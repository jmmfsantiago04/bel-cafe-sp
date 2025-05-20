import { getCategories } from "@/app/actions/categories"
import { MenuCategoriesTable } from "@/components/admin/menu-categories-table"
import { MenuCategoriesProvider } from "@/components/menu/menu-categories-context"
import type { MenuCategory } from "@/components/menu/menu-categories-context"

export default async function CategoriesPage() {
    const { data = [] } = await getCategories()
    const categories: MenuCategory[] = data.map(category => ({
        ...category,
        type: category.type as "menu" | "drink"
    }))

    return (
        <div className="container mx-auto py-8">
            <MenuCategoriesProvider initialCategories={categories}>
                <MenuCategoriesTable initialCategories={categories} />
            </MenuCategoriesProvider>
        </div>
    )
} 