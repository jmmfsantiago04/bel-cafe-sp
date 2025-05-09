import { DiscountForm } from "@/components/admin/discount-form"
import { getActiveDiscounts } from "@/app/actions/discounts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscountItem } from "@/components/admin/discount-item"

export default async function DiscountsPage() {
    const discounts = await getActiveDiscounts();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-[#4A2512]">Gerenciar Descontos</h1>
                <p className="text-[#8B4513]/80 mt-2">
                    Aplique e gerencie descontos para itens do cardápio e bebidas
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Formulário de Desconto */}
                <Card className="bg-white shadow-md">
                    <CardHeader>
                        <CardTitle className="text-[#4A2512]">Novo Desconto</CardTitle>
                        <CardDescription className="text-[#8B4513]/80">
                            Selecione um item e defina o desconto
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DiscountForm />
                    </CardContent>
                </Card>

                {/* Lista de Descontos Ativos */}
                <Card className="bg-white shadow-md">
                    <CardHeader>
                        <CardTitle className="text-[#4A2512]">Descontos Ativos</CardTitle>
                        <CardDescription className="text-[#8B4513]/80">
                            Visualize e gerencie os descontos ativos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {!('error' in discounts) ? (
                            <div className="space-y-4">
                                {/* Descontos do Menu */}
                                {discounts.menu.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-[#4A2512] mb-2">Itens do Cardápio</h3>
                                        <div className="space-y-2">
                                            {discounts.menu.map((item) => (
                                                <DiscountItem
                                                    key={item.id}
                                                    id={item.id}
                                                    name={item.name}
                                                    discount={item.discount}
                                                    type="menu"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Descontos de Bebidas */}
                                {discounts.drinks.length > 0 && (
                                    <div>
                                        <h3 className="font-semibold text-[#4A2512] mb-2">Bebidas</h3>
                                        <div className="space-y-2">
                                            {discounts.drinks.map((drink) => (
                                                <DiscountItem
                                                    key={drink.id}
                                                    id={drink.id}
                                                    name={drink.name}
                                                    discount={drink.discount}
                                                    type="drink"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {discounts.menu.length === 0 && discounts.drinks.length === 0 && (
                                    <p className="text-center text-[#8B4513]/80 py-4">
                                        Nenhum desconto ativo no momento
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-center text-red-600 py-4">
                                Erro ao carregar descontos: {discounts.error}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 