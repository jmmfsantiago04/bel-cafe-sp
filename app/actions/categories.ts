'use server'

import { db } from "@/lib/db"
import { menuCategories, menuItems, drinks } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type MenuCategoryFormData = {
    id?: number
    name: string
    slug: string
    type: "menu" | "drink"
    flag: string
    isActive: boolean
    displayOrder: number
}

const defaultCategories = [
    {
        name: "Café da Manhã",
        slug: "cafe-manha",
        type: "menu",
        flag: "isCafeDaManha",
        isActive: true,
        displayOrder: 0,
    },
    {
        name: "Almoço",
        slug: "almoco",
        type: "menu",
        flag: "isAlmoco",
        isActive: true,
        displayOrder: 1,
    },
    {
        name: "Jantar",
        slug: "jantar",
        type: "menu",
        flag: "isJantar",
        isActive: true,
        displayOrder: 2,
    },
    {
        name: "Salgados",
        slug: "salgados",
        type: "menu",
        flag: "isSalgado",
        isActive: true,
        displayOrder: 3,
    },
    {
        name: "Doces",
        slug: "doces",
        type: "menu",
        flag: "isDoce",
        isActive: true,
        displayOrder: 4,
    },
    {
        name: "Sobremesas",
        slug: "sobremesas",
        type: "menu",
        flag: "isSobremesa",
        isActive: true,
        displayOrder: 5,
    },
    {
        name: "Bebidas Quentes",
        slug: "bebidas-quentes",
        type: "drink",
        flag: "isHotDrink",
        isActive: true,
        displayOrder: 6,
    },
    {
        name: "Bebidas Frias",
        slug: "bebidas-frias",
        type: "drink",
        flag: "isHotDrink",
        isActive: true,
        displayOrder: 7,
    },
] as const

export async function initializeCategories() {
    try {
        for (const category of defaultCategories) {
            await db.insert(menuCategories).values(category)
        }
        revalidatePath("/admin/categories")
        return { success: true }
    } catch (error) {
        console.error("Error initializing categories:", error)
        return { success: false, error }
    }
}

export async function getCategories() {
    try {
        const categories = await db.query.menuCategories.findMany({
            orderBy: (categories, { asc }) => [asc(categories.displayOrder)],
        })
        return { success: true, data: categories }
    } catch (error) {
        console.error("Error fetching categories:", error)
        return { success: false, error }
    }
}

export async function updateCategory(data: MenuCategoryFormData) {
    try {
        if (data.id) {
            // Get the current category to compare changes
            const currentCategory = await db.query.menuCategories.findFirst({
                where: eq(menuCategories.id, data.id)
            })

            // Update the category
            await db.update(menuCategories)
                .set({
                    name: data.name,
                    slug: data.slug,
                    type: data.type,
                    flag: data.flag,
                    isActive: data.isActive,
                    displayOrder: data.displayOrder,
                    updatedAt: new Date(),
                })
                .where(eq(menuCategories.id, data.id))

            // Update item availability if isActive changed
            if (currentCategory && currentCategory.isActive !== data.isActive) {
                if (data.type === "menu") {
                    await db.update(menuItems)
                        .set({ isAvailable: data.isActive })
                        .where(eq(menuItems[data.flag as keyof typeof menuItems], true))
                } else {
                    await db.update(drinks)
                        .set({ isAvailable: data.isActive })
                        .where(eq(drinks[data.flag as keyof typeof drinks], true))
                }
            }
        } else {
            // Create new category
            await db.insert(menuCategories).values({
                name: data.name,
                slug: data.slug,
                type: data.type,
                flag: data.flag,
                isActive: data.isActive,
                displayOrder: data.displayOrder,
            })
        }

        revalidatePath("/admin/categories")
        revalidatePath("/menu")
        return { success: true }
    } catch (error) {
        console.error("Error updating category:", error)
        return { success: false, error }
    }
}

export async function deleteCategory(id: number) {
    try {
        // Get the category before deleting
        const category = await db.query.menuCategories.findFirst({
            where: eq(menuCategories.id, id)
        })

        if (!category) {
            throw new Error("Category not found")
        }

        // Disable all items in this category
        if (category.type === "menu") {
            await db.update(menuItems)
                .set({ isAvailable: false })
                .where(eq(menuItems[category.flag as keyof typeof menuItems], true))
        } else {
            await db.update(drinks)
                .set({ isAvailable: false })
                .where(eq(drinks[category.flag as keyof typeof drinks], true))
        }

        // Delete the category
        await db.delete(menuCategories).where(eq(menuCategories.id, id))

        revalidatePath("/admin/categories")
        revalidatePath("/menu")
        return { success: true }
    } catch (error) {
        console.error("Error deleting category:", error)
        return { success: false, error }
    }
} 