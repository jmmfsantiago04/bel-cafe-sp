import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCategories, initializeCategories } from "@/app/actions/categories"
import { MenuCategoriesTable } from "@/components/admin/menu-categories-table"

export default async function CategoriesPage() {
    // Inicializar categorias se necessário
    await initializeCategories()

    // Buscar categorias
    const categories = await getCategories()

    return (
        <div className="container mx-auto py-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-[#8B4513]">
                        Gerenciar Categorias
                    </CardTitle>
                    <CardDescription>
                        Ative ou desative categorias do menu e bebidas para controlar sua visibilidade no site
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <MenuCategoriesTable initialCategories={categories} />
                </CardContent>
            </Card>
        </div>
    )
} 