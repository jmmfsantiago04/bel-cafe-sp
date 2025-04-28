import { Card } from "@/components/ui/card"
import { getCategories } from "@/app/actions/categories"
import { CreateCategoryDialog } from "@/components/admin/create-category-dialog"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function CategoriesPage() {
    const { data: categories, error } = await getCategories()

    if (error) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Categorias</h1>
                        <p className="text-[#D2691E] text-sm">Gerencie as categorias do seu cardápio</p>
                    </div>
                    <CreateCategoryDialog />
                </div>
                <Card className="flex-1 p-6 bg-white shadow-md border border-[#DEB887]">
                    <p className="text-red-600">
                        {error}
                    </p>
                </Card>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Categorias</h1>
                    <p className="text-[#D2691E] text-sm">Gerencie as categorias do seu cardápio</p>
                </div>
                <CreateCategoryDialog />
            </div>

            <Card className="flex-1 bg-white shadow-md border border-[#DEB887]">
                <div className="h-full overflow-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAEBD7] border-b border-[#DEB887] sticky top-0 z-10">
                            <tr>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Nome</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold hidden md:table-cell">Descrição</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Status</th>
                                <th className="text-right px-6 py-4 text-[#8B4513] font-serif font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEB887]">
                            {categories?.map((category) => (
                                <tr key={category.id} className="hover:bg-[#FDF5E6] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#8B4513]">{category.name}</div>
                                        <div className="text-sm text-[#D2691E] md:hidden">{category.description || "—"}</div>
                                    </td>
                                    <td className="px-6 py-4 text-[#8B4513] hidden md:table-cell">{category.description || "—"}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${category.isActive
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {category.isActive ? "Ativa" : "Inativa"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="border-[#DEB887] text-[#8B4513] hover:bg-[#FAEBD7] transition-colors"
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
                                    <td colSpan={4} className="px-6 py-8 text-center">
                                        <div className="space-y-2">
                                            <p className="text-[#8B4513] font-medium">Nenhuma categoria encontrada</p>
                                            <p className="text-[#D2691E] text-sm">
                                                Comece criando uma nova categoria para organizar seu cardápio
                                            </p>
                                        </div>
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