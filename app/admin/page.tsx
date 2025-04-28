import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
import { menuItems, categories } from "@/db/schema"
import { count } from "drizzle-orm"
import { and, eq } from "drizzle-orm"

export default async function AdminDashboard() {
    // Fetch all stats in parallel using Promise.all
    const [
        totalItems,
        activeCategories,
        popularItems,
        discountedItems,
    ] = await Promise.all([
        db.select({ value: count() }).from(menuItems).then(result => result[0]),
        db.select({ value: count() }).from(categories).where(eq(categories.isActive, true)).then(result => result[0]),
        db.select({ value: count() }).from(menuItems).where(eq(menuItems.isPopular, true)).then(result => result[0]),
        db.select({ value: count() }).from(menuItems).where(eq(menuItems.isDiscounted, true)).then(result => result[0]),
    ]).catch(error => {
        console.error('Error fetching dashboard data:', error)
        return [{ value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }]
    })

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Dashboard</h1>
                    <p className="text-[#D2691E] text-sm">Visão geral do seu negócio</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card className="p-6 bg-white shadow-md border border-[#DEB887]">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Total de Itens</h3>
                    <p className="text-3xl font-bold mt-2 text-[#8B4513]">{totalItems.value}</p>
                    <p className="text-sm text-[#D2691E] mt-1">Itens no cardápio</p>
                </Card>

                <Card className="p-6 bg-white shadow-md border border-[#DEB887]">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Categorias</h3>
                    <p className="text-3xl font-bold mt-2 text-[#8B4513]">{activeCategories.value}</p>
                    <p className="text-sm text-[#D2691E] mt-1">Categorias ativas</p>
                </Card>

                <Card className="p-6 bg-white shadow-md border border-[#DEB887]">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Itens Populares</h3>
                    <p className="text-3xl font-bold mt-2 text-[#8B4513]">{popularItems.value}</p>
                    <p className="text-sm text-[#D2691E] mt-1">Marcados como populares</p>
                </Card>

                <Card className="p-6 bg-white shadow-md border border-[#DEB887]">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Itens com Desconto</h3>
                    <p className="text-3xl font-bold mt-2 text-[#8B4513]">{discountedItems.value}</p>
                    <p className="text-sm text-[#D2691E] mt-1">Com desconto ativo</p>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <Card className="flex-1 bg-white shadow-md border border-[#DEB887]">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-[#8B4513] mb-6 font-serif">Atividade Recente</h2>
                    <div className="space-y-4">
                        <p className="text-center text-[#D2691E]">
                            Sistema de atividades em desenvolvimento
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
} 