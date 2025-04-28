import { getCategoryById } from "@/app/actions/categories"
import { CategoriesForm } from "@/components/admin/categories-form"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
        <div className="h-full space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Editar Categoria</h1>
                    <p className="text-[#D2691E] text-sm">Atualize as informações da categoria</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-[#DEB887] text-[#8B4513] hover:bg-[#FAEBD7]"
                    asChild
                >
                    <Link href="/admin/categories">
                        Voltar para Categorias
                    </Link>
                </Button>
            </div>

            <div className="w-full">
                <CategoriesForm
                    initialData={category}
                    categoryId={categoryId}
                />
            </div>
        </div>
    )
} 