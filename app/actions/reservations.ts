'use server'

import { db } from "@/lib/db"
import { eq, and, desc, sql } from "drizzle-orm"
import { reservations } from "@/db/schema"
import { revalidatePath } from "next/cache"

export async function getAllReservations() {
    try {
        const result = await db
            .select()
            .from(reservations)
            .orderBy(desc(reservations.date))

        return { data: result }
    } catch (error) {
        console.error('Error getting reservations:', error)
        return { error: 'Erro ao buscar reservas' }
    }
}

export async function getReservationCount(date: string, mealPeriod: string) {
    try {
        const result = await db
            .select({
                totalGuests: sql<number>`sum(${reservations.guests})`
            })
            .from(reservations)
            .where(
                and(
                    eq(reservations.date, date),
                    eq(reservations.mealPeriod, mealPeriod),
                    sql`${reservations.status} IN ('pending', 'confirmed')`
                )
            );

        return { totalGuests: Number(result[0]?.totalGuests) || 0 };
    } catch (error) {
        console.error('Error getting reservation count:', error);
        return { error: 'Erro ao buscar contagem de reservas' };
    }
}

export async function createReservation(data: any) {
    try {
        const now = new Date().toISOString()

        const result = await db.insert(reservations).values({
            ...data,
            createdAt: now,
            updatedAt: now,
        }).returning()

        return { data: result[0] }
    } catch (error) {
        console.error('Error creating reservation:', error)
        return { error: 'Erro ao criar reserva' }
    }
}

export async function updateReservationStatus(id: number, status: string) {
    try {
        const result = await db
            .update(reservations)
            .set({
                status,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(reservations.id, id))
            .returning()

        revalidatePath('/admin/reservations')
        return { data: result[0] }
    } catch (error) {
        console.error('Error updating reservation status:', error)
        return { error: 'Erro ao atualizar status da reserva' }
    }
}

export async function deleteReservation(id: number) {
    try {
        const result = await db
            .delete(reservations)
            .where(eq(reservations.id, id))
            .returning()

        revalidatePath('/admin/reservations')
        return { data: result[0] }
    } catch (error) {
        console.error('Error deleting reservation:', error)
        return { error: 'Erro ao deletar reserva' }
    }
}

export async function updateReservation(id: number, data: any) {
    try {
        const result = await db
            .update(reservations)
            .set({
                ...data,
                updatedAt: new Date().toISOString(),
            })
            .where(eq(reservations.id, id))
            .returning()

        revalidatePath('/admin/reservations')
        return { data: result[0] }
    } catch (error) {
        console.error('Error updating reservation:', error)
        return { error: 'Erro ao atualizar reserva' }
    }
}

export async function createReservationByAdmin(data: any) {
    try {
        const now = new Date().toISOString()

        const result = await db.insert(reservations).values({
            ...data,
            createdAt: now,
            updatedAt: now,
        }).returning()

        revalidatePath('/admin/reservations')
        return { data: result[0] }
    } catch (error) {
        console.error('Error creating reservation:', error)
        return { error: 'Erro ao criar reserva' }
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