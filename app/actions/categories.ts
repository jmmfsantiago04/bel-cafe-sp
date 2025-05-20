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
        type: "menu" as const,
        flag: "isCafeDaManha",
        isActive: true,
        displayOrder: 0,
    },
    {
        name: "Almoço",
        slug: "almoco",
        type: "menu" as const,
        flag: "isAlmoco",
        isActive: true,
        displayOrder: 1,
    },
    {
        name: "Jantar",
        slug: "jantar",
        type: "menu" as const,
        flag: "isJantar",
        isActive: true,
        displayOrder: 2,
    },
    {
        name: "Salgados",
        slug: "salgados",
        type: "menu" as const,
        flag: "isSalgado",
        isActive: true,
        displayOrder: 3,
    },
    {
        name: "Doces",
        slug: "doces",
        type: "menu" as const,
        flag: "isDoce",
        isActive: true,
        displayOrder: 4,
    },
    {
        name: "Sobremesas",
        slug: "sobremesas",
        type: "menu" as const,
        flag: "isSobremesa",
        isActive: true,
        displayOrder: 5,
    },
    {
        name: "Bebidas Quentes",
        slug: "bebidas-quentes",
        type: "drink" as const,
        flag: "isHotDrink",
        isActive: true,
        displayOrder: 6,
    },
    {
        name: "Bebidas Frias",
        slug: "bebidas-frias",
        type: "drink" as const,
        flag: "isColdDrink",
        isActive: true,
        displayOrder: 7,
    },
]

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

function updateMenuItemsAvailability(flag: string, isActive: boolean) {
    switch (flag) {
        case "isCafeDaManha":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isCafeDaManha, true))
        case "isAlmoco":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isAlmoco, true))
        case "isJantar":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isJantar, true))
        case "isSalgado":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isSalgado, true))
        case "isDoce":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isDoce, true))
        case "isSobremesa":
            return db.update(menuItems)
                .set({ isAvailable: isActive })
                .where(eq(menuItems.isSobremesa, true))
        default:
            return Promise.resolve()
    }
}

function updateDrinksAvailability(flag: string, isActive: boolean) {
    if (flag === "isHotDrink") {
        return db.update(drinks)
            .set({ isAvailable: isActive })
            .where(eq(drinks.isHotDrink, true))
    }
    return Promise.resolve()
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
                    await updateMenuItemsAvailability(data.flag, data.isActive)
                } else if (data.type === "drink") {
                    await updateDrinksAvailability(data.flag, data.isActive)
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
            await updateMenuItemsAvailability(category.flag, false)
        } else if (category.type === "drink") {
            await updateDrinksAvailability(category.flag, false)
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