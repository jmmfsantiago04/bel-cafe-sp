'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
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

function sameCategoryList(a: MenuCategory[], b: MenuCategory[]) {
    if (a === b) return true
    if (a.length !== b.length) return false
    return a.every((cat, index) => {
        const other = b[index]
        return (
            cat.id === other.id &&
            cat.slug === other.slug &&
            cat.isActive === other.isActive &&
            cat.displayOrder === other.displayOrder &&
            cat.name === other.name &&
            cat.flag === other.flag &&
            cat.type === other.type
        )
    })
}

export function MenuCategoriesProvider({
    children,
    initialCategories,
}: {
    children: ReactNode
    initialCategories: MenuCategory[]
}) {
    const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)

    // Sync when parent finishes loading categories — skip if content is unchanged
    useEffect(() => {
        setCategories((prev) =>
            sameCategoryList(prev, initialCategories) ? prev : initialCategories,
        )
    }, [initialCategories])

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
