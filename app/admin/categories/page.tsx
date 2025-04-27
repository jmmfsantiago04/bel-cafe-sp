import { Card } from "@/components/ui/card"
import { getCategories } from "@/app/actions/categories"
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
    const { data: categories, error } = await getCategories()

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[#8B4513]">Categorias</h1>
                    <CreateCategoryDialog />
                </div>
                <Card className="p-6 bg-white shadow-lg">
                    <p className="text-red-600">
                        {error}
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#8B4513]">Categorias</h1>
                <CreateCategoryDialog />
            </div>

            <Card className="bg-white shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAEBD7] border-b border-[#DEB887]">
                            <tr>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Nome</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Descrição</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Status</th>
                                <th className="text-right p-4 text-[#8B4513] font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEB887]">
                            {categories?.map((category) => (
                                <tr key={category.id} className="hover:bg-[#FDF5E6]">
                                    <td className="p-4">{category.name}</td>
                                    <td className="p-4">{category.description || "—"}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${category.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                            {category.isActive ? "Ativa" : "Inativa"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-[#DEB887] text-[#8B4513] hover:bg-[#FAEBD7]"
                                            asChild
                                        >
                                            <Link href={`/admin/categories/${category.id}`}>
                                                Editar
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            {(!categories || categories.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-gray-500">
                                        Nenhuma categoria encontrada
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
} 