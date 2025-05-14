'use client'

import { createContext, useContext, useEffect, useState } from "react"
import { LucideIcon } from "lucide-react"

export type MenuCategory = {
    id: number
    name: string
    slug: string
    type: "menu" | "drink"
    flag: string
    isActive: boolean
    displayOrder: number
    icon?: LucideIcon
}

type MenuCategoriesContextType = {
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
    children: React.ReactNode
    initialCategories: MenuCategory[]
}) {
    const [categories, setCategories] = useState<MenuCategory[]>(initialCategories)

    const updateCategory = (updatedCategory: MenuCategory) => {
        setCategories(prev =>
            prev.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat)
        )
    }

    const deleteCategory = (id: number) => {
        setCategories(prev => prev.filter(cat => cat.id !== id))
    }

    return (
        <MenuCategoriesContext.Provider value={{ categories, setCategories, updateCategory, deleteCategory }}>
            {children}
        </MenuCategoriesContext.Provider>
    )
}

export function useMenuCategories() {
    const context = useContext(MenuCategoriesContext)
    if (context === undefined) {
        throw new Error('useMenuCategories must be used within a MenuCategoriesProvider')
    }
    return context
} 