'use server'

import { db } from "@/lib/db"
import { businessHours } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type BusinessHoursFormData = {
    id?: number
    period: "cafe" | "almoco" | "jantar" | "geral"
    weekdays: string
    openTime: string
    closeTime: string
    isActive: boolean
    isGeneralHours?: boolean
    createdAt?: Date
    updatedAt?: Date
}

export async function updateBusinessHours(data: BusinessHoursFormData) {
    try {
        const existingHours = await db.query.businessHours.findFirst({
            where: eq(businessHours.period, data.period)
        });

        if (existingHours) {
            await db.update(businessHours)
                .set({
                    weekdays: data.weekdays,
                    openTime: data.openTime,
                    closeTime: data.closeTime,
                    isActive: data.isActive,
                    isGeneralHours: data.isGeneralHours,
                    updatedAt: new Date()
                })
                .where(eq(businessHours.id, existingHours.id));
        } else {
            await db.insert(businessHours).values({
                period: data.period,
                weekdays: data.weekdays,
                openTime: data.openTime,
                closeTime: data.closeTime,
                isActive: data.isActive,
                isGeneralHours: data.isGeneralHours,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Error updating business hours:", error)
        return { error: "Failed to update business hours" }
    }
}

export async function deleteBusinessHours(id: number) {
    try {
        await db.delete(businessHours).where(eq(businessHours.id, id))
        revalidatePath("/admin/settings")
        return { success: true }
    } catch (error) {
        console.error("Error deleting business hours:", error)
        return { error: "Failed to delete business hours" }
    }
} 