'use server'

import { db } from "@/lib/db"
import { drinks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type DrinkFormData = {
    name: string
    description: string | null
    price: number
    imageUrl: string | null
    isHotDrink: boolean
    isAvailable: boolean
    isPopular: boolean
    isAlcoholic: boolean
    isGlutenFree: boolean
    isVegetarian: boolean
    isVegan: boolean
    hasSize: boolean
    mediumSizePrice: number | null
    largeSizePrice: number | null
}

export async function createDrink(data: DrinkFormData) {
    try {
        const drinkData = {
            ...data,
            price: data.price.toString(),
            mediumSizePrice: data.mediumSizePrice?.toString() || null,
            largeSizePrice: data.largeSizePrice?.toString() || null,
            finalPrice: data.price.toString(),
            mediumFinalPrice: data.mediumSizePrice?.toString() || null,
            largeFinalPrice: data.largeSizePrice?.toString() || null,
        }

        await db.insert(drinks).values(drinkData)

        revalidatePath('/menu')
        revalidatePath('/admin/menu')

        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to create drink"
        }
    }
}

export async function updateDrink(id: number, data: Partial<DrinkFormData>) {
    try {
        const updateData = {
            ...data,
            price: data.price?.toString(),
            mediumSizePrice: data.mediumSizePrice?.toString() || null,
            largeSizePrice: data.largeSizePrice?.toString() || null,
            finalPrice: data.price?.toString(),
            mediumFinalPrice: data.mediumSizePrice?.toString() || null,
            largeFinalPrice: data.largeSizePrice?.toString() || null,
        }

        await db.update(drinks)
            .set(updateData)
            .where(eq(drinks.id, id))

        revalidatePath('/menu')
        revalidatePath('/admin/menu')

        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to update drink"
        }
    }
}

export async function deleteDrink(id: number) {
    try {
        await db.delete(drinks).where(eq(drinks.id, id))

        revalidatePath('/menu')
        revalidatePath('/admin/menu')

        return { success: true }
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to delete drink"
        }
    }
} 