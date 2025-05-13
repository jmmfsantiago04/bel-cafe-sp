'use server'

import { db } from "@/lib/db"
import { menuItems } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type MenuItemFormData = {
    name: string
    description?: string | null
    price: number
    imageUrl?: string | null
    isSalgado: boolean
    isDoce: boolean
    isCafeDaManha: boolean
    isAlmoco: boolean
    isJantar: boolean
    isSobremesa: boolean
    isSugarFree: boolean
    isAvailable: boolean
    isPopular: boolean
    hasSize: boolean
    mediumSizePrice?: number | null
    largeSizePrice?: number | null
    isGlutenFree: boolean
    isVegetarian: boolean
    isVegan: boolean
}

export async function createMenuItem(data: MenuItemFormData) {
    try {
        const result = await db.insert(menuItems).values({
            name: data.name,
            description: data.description || null,
            price: data.price.toString(),
            imageUrl: data.imageUrl || null,
            isSalgado: data.isSalgado,
            isDoce: data.isDoce,
            isCafeDaManha: data.isCafeDaManha,
            isAlmoco: data.isAlmoco,
            isJantar: data.isJantar,
            isSobremesa: data.isSobremesa,
            isSugarFree: data.isSugarFree,
            isAvailable: data.isAvailable,
            isPopular: data.isPopular,
            hasSize: data.hasSize,
            mediumSizePrice: data.mediumSizePrice?.toString() || null,
            largeSizePrice: data.largeSizePrice?.toString() || null,
            isGlutenFree: data.isGlutenFree,
            isVegetarian: data.isVegetarian,
            isVegan: data.isVegan,
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
                price: data.price.toString(),
                imageUrl: data.imageUrl || null,
                isSalgado: data.isSalgado,
                isDoce: data.isDoce,
                isCafeDaManha: data.isCafeDaManha,
                isAlmoco: data.isAlmoco,
                isJantar: data.isJantar,
                isSobremesa: data.isSobremesa,
                isSugarFree: data.isSugarFree,
                isAvailable: data.isAvailable,
                isPopular: data.isPopular,
                hasSize: data.hasSize,
                mediumSizePrice: data.mediumSizePrice?.toString() || null,
                largeSizePrice: data.largeSizePrice?.toString() || null,
                isGlutenFree: data.isGlutenFree,
                isVegetarian: data.isVegetarian,
                isVegan: data.isVegan,
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
        await db.delete(menuItems).where(eq(menuItems.id, id))
        revalidatePath('/admin/menu')
        return { success: true }
    } catch (error) {
        console.error("Error deleting menu item:", error)
        return { error: "Falha ao deletar item do cardápio" }
    }
}

export async function getSalgados() {
    try {
        const items = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.isSalgado, true))
        return { data: items }
    } catch (error) {
        console.error("Error fetching salgados:", error)
        return { error: "Falha ao buscar salgados" }
    }
}

export async function getDoces() {
    try {
        const items = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.isDoce, true))
        return { data: items }
    } catch (error) {
        console.error("Error fetching doces:", error)
        return { error: "Falha ao buscar doces" }
    }
}

export async function getAlmoco() {
    try {
        const items = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.isAlmoco, true))
        return { data: items }
    } catch (error) {
        console.error("Error fetching almoço items:", error)
        return { error: "Falha ao buscar itens do almoço" }
    }
}

export async function getJantar() {
    try {
        const items = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.isJantar, true))
        return { data: items }
    } catch (error) {
        console.error("Error fetching jantar items:", error)
        return { error: "Falha ao buscar itens do jantar" }
    }
}

export async function getSobremesas() {
    try {
        const items = await db
            .select()
            .from(menuItems)
            .where(eq(menuItems.isSobremesa, true))
        return { data: items }
    } catch (error) {
        console.error("Error fetching sobremesas:", error)
        return { error: "Falha ao buscar sobremesas" }
    }
} 