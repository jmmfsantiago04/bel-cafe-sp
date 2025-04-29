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

export async function getDrink(id: number) {
    try {
        const drink = await db.select().from(drinks).where(eq(drinks.id, id))
        return drink[0]
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to fetch drink"
        }
    }
}

export async function getAllDrinks() {
    try {
        const allDrinks = await db.select().from(drinks)
        return allDrinks
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to fetch drinks"
        }
    }
}

export async function getHotDrinks() {
    try {
        const hotDrinks = await db
            .select()
            .from(drinks)
            .where(eq(drinks.isHotDrink, true))
        return hotDrinks
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to fetch hot drinks"
        }
    }
}

export async function getColdDrinks() {
    try {
        const coldDrinks = await db
            .select()
            .from(drinks)
            .where(eq(drinks.isHotDrink, false))
        return coldDrinks
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : "Failed to fetch cold drinks"
        }
    }
} 