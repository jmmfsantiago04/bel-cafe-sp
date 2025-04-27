import { Card } from "@/components/ui/card"

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#8B4513]">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Total de Itens</h3>
                    <p className="text-3xl font-bold mt-2">24</p>
                    <p className="text-sm text-gray-500 mt-1">Itens no cardápio</p>
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Categorias</h3>
                    <p className="text-3xl font-bold mt-2">5</p>
                    <p className="text-sm text-gray-500 mt-1">Categorias ativas</p>
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Itens Populares</h3>
                    <p className="text-3xl font-bold mt-2">8</p>
                    <p className="text-sm text-gray-500 mt-1">Marcados como populares</p>
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                    <h3 className="text-lg font-semibold text-[#8B4513]">Itens com Desconto</h3>
                    <p className="text-3xl font-bold mt-2">3</p>
                    <p className="text-sm text-gray-500 mt-1">Com desconto ativo</p>
                </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-[#8B4513] mb-6">Atividade Recente</h2>
                <Card className="p-6 bg-white shadow-lg">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div>
                                <p className="font-medium">Café de Corda adicionado</p>
                                <p className="text-sm text-gray-500">Categoria: Cafés</p>
                            </div>
                            <span className="text-sm text-gray-500">Há 2 horas</span>
                        </div>
                        <div className="flex items-center justify-between pb-4 border-b">
                            <div>
                                <p className="font-medium">Bolo de Rolo atualizado</p>
                                <p className="text-sm text-gray-500">Preço alterado</p>
                            </div>
                            <span className="text-sm text-gray-500">Há 3 horas</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">Nova categoria adicionada</p>
                                <p className="text-sm text-gray-500">Doces Regionais</p>
                            </div>
                            <span className="text-sm text-gray-500">Há 5 horas</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    )
} 