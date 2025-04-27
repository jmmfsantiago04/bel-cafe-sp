'use server'

import { db } from "@/lib/db"
import { menuItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type MenuItemFormData = {
    name: string
    description?: string | null
    categoryId: number
    price: number
    imageUrl?: string | null
    isAvailable: boolean
    isPopular: boolean
    hasSize: boolean
    mediumSizePrice?: number | null
    largeSizePrice?: number | null
}

export async function getMenuItems() {
    try {
        const result = await db.select().from(menuItems)
        return { data: result, error: null }
    } catch (error) {
        console.error("Error fetching menu items:", error)
        return { data: [], error: "Falha ao buscar itens do cardápio" }
    }
}

export async function getMenuItemById(id: number) {
    try {
        const result = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.id, id))
            .limit(1)

        return { data: result[0] }
    } catch (error) {
        console.error("Error fetching menu item:", error)
        return { error: "Falha ao buscar item do cardápio" }
    }
}

export async function createMenuItem(data: MenuItemFormData) {
    try {
        const result = await db.insert(menuItems).values({
            name: data.name,
            description: data.description || null,
            categoryId: data.categoryId,
            price: data.price.toString(),
            imageUrl: data.imageUrl || null,
            isAvailable: data.isAvailable,
            isPopular: data.isPopular,
            hasSize: data.hasSize,
            mediumSizePrice: data.mediumSizePrice?.toString() || null,
            largeSizePrice: data.largeSizePrice?.toString() || null,
            discount: '0',
            isDiscounted: false,
        }).returning()

        revalidatePath('/admin/menu')
        return { data: result[0] }
    } catch (error) {
        console.error("Error creating menu item:", error)
        return { error: "Falha ao criar item do cardápio" }
    }
}

export async function updateMenuItem(id: number, data: MenuItemFormData) {
    try {
        const result = await db
            .update(menuItems)
            .set({
                name: data.name,
                description: data.description || null,
                categoryId: data.categoryId,
                price: data.price.toString(),
                imageUrl: data.imageUrl || null,
                isAvailable: data.isAvailable,
                isPopular: data.isPopular,
                hasSize: data.hasSize,
                mediumSizePrice: data.mediumSizePrice?.toString() || null,
                largeSizePrice: data.largeSizePrice?.toString() || null,
            })
            .where(eq(menuItems.id, id))
            .returning()

        revalidatePath('/admin/menu')
        return { data: result[0] }
    } catch (error) {
        console.error("Error updating menu item:", error)
        return { error: "Falha ao atualizar item do cardápio" }
    }
}

export async function deleteMenuItem(id: number) {
    try {
        const result = await db
            .delete(menuItems)
            .where(eq(menuItems.id, id))
            .returning()

        revalidatePath('/admin/menu')
        return { data: result[0] }
    } catch (error) {
        console.error("Error deleting menu item:", error)
        return { error: "Falha ao excluir item do cardápio" }
    }
} 