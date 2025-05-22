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
    const [isLoading, setIsLoading] = useState(true)

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
            } finally {
                setIsLoading(false)
            }
        }

        loadCategories()
    }, [])

    if (isLoading) {
        return null // Or a loading spinner
    }

    return (
        <MenuCategoriesProvider initialCategories={categories}>
            {children}
        </MenuCategoriesProvider>
    )
} 