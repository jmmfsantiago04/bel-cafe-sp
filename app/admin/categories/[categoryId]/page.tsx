import { getCategoryById } from "@/app/actions/categories"
import { CategoriesForm } from "@/components/admin/categories-form"
import { notFound } from "next/navigation"

interface CategoryPageProps {
    params: {
        categoryId: string
    }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const categoryId = parseInt(params.categoryId)
    if (isNaN(categoryId)) {
        notFound()
    }

    const { data: category, error } = await getCategoryById(categoryId)

    if (error || !category) {
        notFound()
    }

    return (
        <div className="max-w-2xl mx-auto">
            <CategoriesForm
                initialData={category}
                categoryId={categoryId}
            />
        </div>
    )
} 