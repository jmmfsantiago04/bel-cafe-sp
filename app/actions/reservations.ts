'use server'

import { db } from "@/lib/db"
import { reservationSettings, reservations } from "@/db/schema"
import { eq, and, sql, not, notInArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type ReservationSettingsData = {
    maxBreakfast: number
    maxLunch: number
    maxDinner: number
}

export async function getReservationSettings() {
    try {
        const settings = await db
            .select()
            .from(reservationSettings)
            .limit(1)

        return settings[0] || {
            maxBreakfast: 30,
            maxLunch: 50,
            maxDinner: 40,
        }
    } catch (error) {
        console.error("Error fetching reservation settings:", error)
        return {
            error: "Falha ao buscar configurações de reserva"
        }
    }
}

export async function updateReservationSettings(data: ReservationSettingsData) {
    try {
        const currentSettings = await db
            .select()
            .from(reservationSettings)
            .limit(1)

        const now = new Date().toISOString()

        if (currentSettings.length === 0) {
            // Create initial settings
            await db.insert(reservationSettings).values({
                ...data,
                updatedAt: now,
            })
        } else {
            // Update existing settings
            await db
                .update(reservationSettings)
                .set({
                    ...data,
                    updatedAt: now,
                })
                .where(eq(reservationSettings.id, currentSettings[0].id))
        }

        revalidatePath('/admin/reservations')
        return { success: true }
    } catch (error) {
        console.error("Error updating reservation settings:", error)
        return {
            error: "Falha ao atualizar configurações de reserva"
        }
    }
}

export async function getReservationCount(date: string, mealPeriod: string): Promise<{ totalGuests: number }> {
    try {
        const reservationsList = await db.select()
            .from(reservations)
            .where(
                and(
                    eq(reservations.date, date),
                    eq(reservations.mealPeriod, mealPeriod),
                    eq(reservations.status, "confirmed")
                )
            );

        const totalGuests = reservationsList.reduce((sum: number, reservation) => sum + reservation.guests, 0);
        return { totalGuests };
    } catch (error) {
        console.error("Error getting reservation count:", error);
        return { totalGuests: 0 };
    }
}

export async function getTodayReservations() {
    try {
        const today = new Date().toISOString().split('T')[0]

        const todayReservations = await db
            .select()
            .from(reservations)
            .where(
                and(
                    eq(reservations.date, today),
                    eq(reservations.status, "confirmed")
                )
            )

        // Group by meal period and sum guests
        const grouped = {
            cafe: todayReservations
                .filter(r => r.mealPeriod === "cafe")
                .reduce((sum, r) => sum + r.guests, 0),
            almoco: todayReservations
                .filter(r => r.mealPeriod === "almoco")
                .reduce((sum, r) => sum + r.guests, 0),
            jantar: todayReservations
                .filter(r => r.mealPeriod === "jantar")
                .reduce((sum, r) => sum + r.guests, 0),
        }

        return grouped
    } catch (error) {
        console.error("Error fetching today's reservations:", error)
        return {
            cafe: 0,
            almoco: 0,
            jantar: 0,
        }
    }
}

export async function getAllReservations() {
    try {
        const allReservations = await db
            .select()
            .from(reservations)
            .orderBy(sql`${reservations.date} DESC, ${reservations.time} ASC`)

        return { data: allReservations }
    } catch (error) {
        console.error("Error fetching all reservations:", error)
        return {
            error: "Falha ao buscar reservas"
        }
    }
}

export async function updateReservationStatus(id: number, status: string) {
    try {
        await db
            .update(reservations)
            .set({
                status,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(reservations.id, id))

        revalidatePath('/admin/reservations')
        return { success: true }
    } catch (error) {
        console.error("Error updating reservation status:", error)
        return {
            error: "Falha ao atualizar status da reserva"
        }
    }
}

export type ReservationData = {
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    mealPeriod: "cafe" | "almoco" | "jantar"
    status?: string
    notes?: string
}

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed" | "no_show";

export async function updateReservation(id: number, data: Partial<ReservationData>) {
    try {
        const now = new Date().toISOString();

        // If changing status to confirmed, check capacity
        if (data.status === "confirmed") {
            const reservation = await db
                .select()
                .from(reservations)
                .where(eq(reservations.id, id))
                .limit(1);

            if (reservation.length === 0) {
                return { error: "Reserva não encontrada" };
            }

            const currentReservation = reservation[0];
            const settings = await getReservationSettings();

            if ('error' in settings) {
                throw new Error(settings.error);
            }

            // Get current count excluding this reservation
            const currentCount = await db
                .select({ count: sql<number>`sum(guests)` })
                .from(reservations)
                .where(
                    and(
                        eq(reservations.date, currentReservation.date),
                        eq(reservations.mealPeriod, currentReservation.mealPeriod),
                        eq(reservations.status, "confirmed"),
                        sql`id != ${id}`
                    )
                );

            const totalCount = (currentCount[0]?.count || 0) + currentReservation.guests;
            const maxCapacity = {
                cafe: settings.maxBreakfast,
                almoco: settings.maxLunch,
                jantar: settings.maxDinner
            }[currentReservation.mealPeriod] ?? 0;

            if (totalCount > maxCapacity) {
                return {
                    error: `Não é possível confirmar esta reserva. Capacidade excedida em ${totalCount - maxCapacity} pessoas.`
                };
            }
        }

        const result = await db
            .update(reservations)
            .set({
                ...data,
                updatedAt: now,
            })
            .where(eq(reservations.id, id))
            .returning();

        revalidatePath('/admin/reservations');
        return { data: result[0] };
    } catch (error) {
        console.error("Error updating reservation:", error);
        return {
            error: "Falha ao atualizar reserva"
        };
    }
}

export async function createReservationByAdmin(data: ReservationData) {
    try {
        // If status is confirmed, check capacity
        if (data.status === "confirmed") {
            const currentCount = await getReservationCount(data.date, data.mealPeriod);
            const settings = await getReservationSettings();

            if ('error' in settings) {
                throw new Error(settings.error);
            }

            const maxCapacity = {
                cafe: settings.maxBreakfast,
                almoco: settings.maxLunch,
                jantar: settings.maxDinner
            }[data.mealPeriod] ?? 0;

            if (currentCount.totalGuests + data.guests > maxCapacity) {
                return {
                    error: `Não há vagas suficientes para ${data.guests} pessoas neste horário. Capacidade restante: ${maxCapacity - currentCount.totalGuests} pessoas.`
                };
            }
        }

        const now = new Date().toISOString();

        const result = await db.insert(reservations).values({
            ...data,
            status: data.status || "pending",
            createdAt: now,
            updatedAt: now,
        }).returning();

        revalidatePath('/admin/reservations');
        return { data: result[0] };
    } catch (error) {
        console.error("Error creating reservation:", error);
        return {
            error: "Falha ao criar reserva"
        };
    }
}

export async function createReservation(data: ReservationData) {
    try {
        const currentDate = new Date().toISOString().split('T')[0];
        const reservationDate = data.date;

        // Check if the reservation is at least 24 hours in advance
        if (reservationDate <= currentDate) {
            return {
                error: "As reservas devem ser feitas com pelo menos 24 horas de antecedência."
            };
        }

        // Get current reservation count for the date and meal period
        const currentCount = await getReservationCount(data.date, data.mealPeriod);

        // Get max capacity for the meal period
        const settings = await getReservationSettings();
        if ('error' in settings) {
            return { error: settings.error };
        }

        // Get max capacity based on meal period
        let maxCapacity: number;
        switch (data.mealPeriod) {
            case "cafe":
                maxCapacity = settings.maxBreakfast ?? 0;
                break;
            case "almoco":
                maxCapacity = settings.maxLunch ?? 0;
                break;
            case "jantar":
                maxCapacity = settings.maxDinner ?? 0;
                break;
            default:
                return { error: "Período de refeição inválido" };
        }

        // Check if adding new guests would exceed capacity
        const newTotalGuests = currentCount.totalGuests + data.guests;
        if (newTotalGuests > maxCapacity) {
            const remaining = maxCapacity - currentCount.totalGuests;
            return {
                error: `Desculpe, não há mais vagas suficientes para ${data.guests} pessoas neste horário. Vagas restantes: ${remaining > 0 ? remaining : 0}.`
            };
        }

        // Create the reservation with pending status
        const result = await db.insert(reservations).values({
            ...data,
            status: "pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }).returning();

        revalidatePath('/admin/reservations');
        return { data: result[0] };
    } catch (error) {
        console.error("Error creating reservation:", error);
        return { error: "Falha ao criar reserva. Por favor, tente novamente." };
    }
}

export async function deleteReservation(id: number) {
    try {
        await db.delete(reservations).where(eq(reservations.id, id))
        revalidatePath('/admin/reservations')
        return { success: true }
    } catch (error) {
        console.error("Error deleting reservation:", error)
        return { error: "Falha ao deletar reserva" }
    }
} 