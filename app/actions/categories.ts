'use server'

import { db } from "@/lib/db"
import { categories } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type CategoryFormData = {
    name: string
    description?: string | null
    isActive: boolean
}

export async function getCategories() {
    try {
        const result = await db.select().from(categories)
        return { data: result }
    } catch (error) {
        console.error("Error fetching categories:", error)
        return { error: "Falha ao buscar categorias" }
    }
}

export async function getCategoryById(id: number) {
    try {
        const result = await db
            .select()
            .from(categories)
            .where(eq(categories.id, id))
            .limit(1)

        return { data: result[0] }
    } catch (error) {
        console.error("Error fetching category:", error)
        return { error: "Falha ao buscar categoria" }
    }
}

export async function createCategory(data: CategoryFormData) {
    try {
        const result = await db.insert(categories).values({
            name: data.name,
            description: data.description || null,
            isActive: data.isActive,
        }).returning()

        revalidatePath('/admin/categories')
        return { data: result[0] }
    } catch (error) {
        console.error("Error creating category:", error)
        return { error: "Falha ao criar categoria" }
    }
}

export async function updateCategory(id: number, data: CategoryFormData) {
    try {
        const result = await db
            .update(categories)
            .set({
                name: data.name,
                description: data.description || null,
                isActive: data.isActive,
            })
            .where(eq(categories.id, id))
            .returning()

        revalidatePath('/admin/categories')
        return { data: result[0] }
    } catch (error) {
        console.error("Error updating category:", error)
        return { error: "Falha ao atualizar categoria" }
    }
}

export async function deleteCategory(id: number) {
    try {
        const result = await db
            .delete(categories)
            .where(eq(categories.id, id))
            .returning()

        revalidatePath('/admin/categories')
        return { data: result[0] }
    } catch (error) {
        console.error("Error deleting category:", error)
        return { error: "Falha ao excluir categoria" }
    }
} 