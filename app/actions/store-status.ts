'use server'

import { db } from "@/lib/db"
import { storeStatus, businessHours } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type StoreStatusData = {
    isOpen: boolean
    reason?: string
    reopenDate?: string
}

export async function updateStoreStatus(data: StoreStatusData) {
    try {
        const currentStatus = await db.query.storeStatus.findFirst()

        if (currentStatus) {
            await db.update(storeStatus)
                .set({
                    isOpen: data.isOpen,
                    reason: data.reason,
                    reopenDate: data.reopenDate,
                    updatedAt: new Date()
                })
                .where(eq(storeStatus.id, currentStatus.id))
        } else {
            await db.insert(storeStatus).values({
                isOpen: data.isOpen,
                reason: data.reason,
                reopenDate: data.reopenDate,
                updatedAt: new Date()
            })
        }

        revalidatePath("/")
        return { success: true }
    } catch (error) {
        console.error("Error updating store status:", error)
        return { error: "Failed to update store status" }
    }
}

export async function getStoreStatus() {
    try {
        // Get current time
        const now = new Date()
        const currentHour = now.getHours().toString().padStart(2, '0')
        const currentMinute = now.getMinutes().toString().padStart(2, '0')
        const currentTime = `${currentHour}:${currentMinute}`
        const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.

        // Get store status from database
        const status = await db.query.storeStatus.findFirst()

        // If store is manually closed, return that status
        if (status && !status.isOpen) {
            return {
                isOpen: false,
                reason: status.reason,
                reopenDate: status.reopenDate
            }
        }

        // Get business hours
        const businessHoursData = await db.query.businessHours.findFirst({
            where: eq(businessHours.isGeneralHours, true)
        })

        if (!businessHoursData || !businessHoursData.isActive) {
            return { isOpen: false, reason: "Horário não disponível" }
        }

        // Check if current day is within operating days
        const weekdaysMap = {
            "Segunda a Sexta": [1, 2, 3, 4, 5],
            "Segunda a Sábado": [1, 2, 3, 4, 5, 6],
            "Segunda a Domingo": [0, 1, 2, 3, 4, 5, 6],
            "Sábado e Domingo": [0, 6]
        }

        const operatingDays = weekdaysMap[businessHoursData.weekdays as keyof typeof weekdaysMap] || []
        const isOperatingDay = operatingDays.includes(currentDay)

        if (!isOperatingDay) {
            return {
                isOpen: false,
                reason: "Fora do horário de funcionamento",
                reopenDate: "Próximo dia útil"
            }
        }

        // Check if current time is within operating hours
        const isWithinHours = currentTime >= businessHoursData.openTime &&
            currentTime <= businessHoursData.closeTime

        return {
            isOpen: isWithinHours,
            reason: isWithinHours ? undefined : "Fora do horário de funcionamento",
            reopenDate: isWithinHours ? undefined : "Hoje " + businessHoursData.openTime
        }
    } catch (error) {
        console.error("Error getting store status:", error)
        return { error: "Failed to get store status" }
    }
} 