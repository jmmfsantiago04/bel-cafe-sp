'use client'

import { createContext, useContext, useState, ReactNode } from "react"
import { MenuCategoryFormData } from "@/app/actions/categories"

export type MenuCategory = MenuCategoryFormData & {
    id?: number
    createdAt?: Date
    updatedAt?: Date
}

interface MenuCategoriesContextType {
    categories: MenuCategory[]
    setCategories: (categories: MenuCategory[]) => void
    updateCategory: (category: MenuCategory) => void
    deleteCategory: (id: number) => void
}

const MenuCategoriesContext = createContext<MenuCategoriesContextType | undefined>(undefined)

export function MenuCategoriesProvider({
    children,
    initialCategories,
}: {
    children: ReactNode
    initialCategories: MenuCategory[]
}) {
    const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)

    const updateCategory = (updatedCategory: MenuCategory) => {
        setCategories(prevCategories =>
            prevCategories.map(category =>
                category.id === updatedCategory.id ? updatedCategory : category
            )
        )
    }

    const deleteCategory = (id: number) => {
        setCategories(prevCategories =>
            prevCategories.filter(category => category.id !== id)
        )
    }

    return (
        <MenuCategoriesContext.Provider
            value={{
                categories,
                setCategories,
                updateCategory,
                deleteCategory,
            }}
        >
            {children}
        </MenuCategoriesContext.Provider>
    )
}

export function useMenuCategories() {
    const context = useContext(MenuCategoriesContext)
    if (context === undefined) {
        throw new Error("useMenuCategories must be used within a MenuCategoriesProvider")
    }
    return context
} 