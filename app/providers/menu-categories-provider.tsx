'use client'

import { getCategories } from "@/app/actions/categories"
import { MenuCategoriesProvider, type MenuCategory } from "@/app/admin/categories/components/menu-categories-context"
import { useEffect, useState } from "react"

export function GlobalMenuCategoriesProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const [categories, setCategories] = useState<MenuCategory[]>([])

    useEffect(() => {
        async function loadCategories() {
            try {
                const result = await getCategories()
                if (result.success && result.data) {
                    setCategories(result.data.map(category => ({
                        ...category,
                        type: category.type as "menu" | "drink"
                    })))
                }
            } catch (error) {
                console.error('Error loading categories:', error)
            }
        }

        loadCategories()
    }, [])

    return (
        <MenuCategoriesProvider initialCategories={categories}>
            {children}
        </MenuCategoriesProvider>
    )
}
