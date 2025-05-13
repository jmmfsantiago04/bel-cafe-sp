import { DiscountForm } from "@/components/admin/discount-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DiscountItem } from "@/components/admin/discount-item"
import { db } from "@/lib/db"
import { menuItems, drinks } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function DiscountsPage() {
    // Fetch all items and drinks
    const [allMenuItems, allDrinks] = await Promise.all([
        db.query.menuItems.findMany(),
        db.query.drinks.findMany()
    ]);

    // Fetch active discounts
    const [menuDiscounts, drinkDiscounts] = await Promise.all([
        db.query.menuItems.findMany({
            where: eq(menuItems.isDiscounted, true)
        }),
        db.query.drinks.findMany({
            where: eq(drinks.isDiscounted, true)
        })
    ])

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
                        <DiscountForm
                            menuItems={allMenuItems}
                            drinks={allDrinks}
                        />
                    </CardContent>
                </Card>

                {/* Lista de Descontos Ativos */}
                <Card className="bg-white shadow-md">
                    <CardHeader>
                        <CardTitle className="text-[#4A2512]">Descontos Ativos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {menuDiscounts.map((item) => (
                                <DiscountItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    discount={item.discount}
                                    type="menu"
                                />
                            ))}
                            {drinkDiscounts.map((item) => (
                                <DiscountItem
                                    key={item.id}
                                    id={item.id}
                                    name={item.name}
                                    discount={item.discount}
                                    type="drink"
                                />
                            ))}
                            {menuDiscounts.length === 0 && drinkDiscounts.length === 0 && (
                                <p className="text-center text-[#8B4513]/80 py-4">
                                    Nenhum desconto ativo no momento
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
} 