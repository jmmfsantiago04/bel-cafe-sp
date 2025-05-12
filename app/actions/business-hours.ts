'use server'

import { db } from "@/lib/db"
import { businessHours } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type BusinessHoursFormData = {
    id?: number
    period: "cafe" | "almoco" | "jantar"
    weekdays: string
    openTime: string
    closeTime: string
    isActive: boolean
    createdAt?: Date
    updatedAt?: Date
}

export async function getBusinessHours() {
    try {
        const hours = await db.select().from(businessHours)
        return hours.map((hour: typeof businessHours.$inferSelect) => ({
            ...hour,
            period: hour.period as "cafe" | "almoco" | "jantar"
        }))
    } catch (error) {
        console.error("Error fetching business hours:", error)
        return { error: "Failed to fetch business hours" }
    }
}

export async function updateBusinessHours(data: BusinessHoursFormData) {
    try {
        // Validate time format (HH:MM)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
        if (!timeRegex.test(data.openTime) || !timeRegex.test(data.closeTime)) {
            return { error: "Invalid time format. Please use HH:MM format" }
        }

        // Validate that opening time is before closing time
        const [openHour, openMinute] = data.openTime.split(":").map(Number)
        const [closeHour, closeMinute] = data.closeTime.split(":").map(Number)
        const openMinutes = openHour * 60 + openMinute
        const closeMinutes = closeHour * 60 + closeMinute

        if (openMinutes >= closeMinutes) {
            return { error: "Opening time must be before closing time" }
        }

        if (data.id) {
            // Update existing business hours
            await db.update(businessHours)
                .set({
                    period: data.period,
                    weekdays: data.weekdays,
                    openTime: data.openTime,
                    closeTime: data.closeTime,
                    isActive: data.isActive,
                    updatedAt: new Date(),
                })
                .where(eq(businessHours.id, data.id))
        } else {
            // Create new business hours
            await db.insert(businessHours).values({
                period: data.period,
                weekdays: data.weekdays,
                openTime: data.openTime,
                closeTime: data.closeTime,
                isActive: data.isActive,
                createdAt: new Date(),
                updatedAt: new Date(),
            })
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