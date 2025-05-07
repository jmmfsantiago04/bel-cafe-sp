import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getMenuItems } from "@/app/actions/menu"
import { DeleteMenuItem } from "@/components/admin/delete-menu-item"
import { MenuDialogs } from "@/components/admin/menu-dialogs"

export default async function MenuPage() {
    const { data: menuItems, error: menuError } = await getMenuItems();

    if (menuError || !menuItems) {
        return (
            <div className="h-full flex flex-col">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Cardápio</h1>
                        <p className="text-[#D2691E] text-sm">Gerencie os itens do seu cardápio</p>
                    </div>
                </div>
                <Card className="flex-1 p-6 bg-white shadow-md border border-[#DEB887]">
                    <p className="text-red-600">
                        {menuError || "Erro ao carregar dados"}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Cardápio</h1>
                    <p className="text-[#D2691E] text-sm">Gerencie os itens do seu cardápio</p>
                </div>
                <MenuDialogs />
            </div>

            <Card className="flex-1 bg-white shadow-md border border-[#DEB887]">
                <div className="h-full overflow-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAEBD7] border-b border-[#DEB887] sticky top-0 z-10">
                            <tr>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Nome</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Categoria</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Preço Base</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Tamanhos</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Status</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Popular</th>
                                <th className="text-left px-6 py-4 text-[#8B4513] font-serif font-semibold">Restrições</th>
                                <th className="text-right px-6 py-4 text-[#8B4513] font-serif font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEB887]">
                            {menuItems.map((item) => (
                                <tr key={item.id} className="hover:bg-[#FDF5E6] transition-colors">
                                    <td className="px-6 py-4">{item.name}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {item.isSalgado && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800">
                                                    🥨 Salgado
                                                </span>
                                            )}
                                            {item.isDoce && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-pink-50 text-pink-800">
                                                    🍰 Doce
                                                </span>
                                            )}
                                            {item.isCafeDaManha && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800">
                                                    ☕ Café da Manhã
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">R$ {Number(item.price).toFixed(2)}</td>
                                    <td className="px-6 py-4">
                                        {item.hasSize ? (
                                            <div className="text-sm">
                                                <div>M: R$ {item.mediumSizePrice ? Number(item.mediumSizePrice).toFixed(2) : "N/A"}</div>
                                                <div>G: R$ {item.largeSizePrice ? Number(item.largeSizePrice).toFixed(2) : "N/A"}</div>
                                            </div>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.isAvailable
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {item.isAvailable ? "Disponível" : "Indisponível"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${item.isPopular
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {item.isPopular ? "Popular" : "Normal"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {item.isGlutenFree && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-800">
                                                    🌾 GF
                                                </span>
                                            )}
                                            {item.isVegetarian && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-800">
                                                    🥬 Veg
                                                </span>
                                            )}
                                            {item.isVegan && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800">
                                                    🌱 Vgn
                                                </span>
                                            )}
                                            {!item.isGlutenFree && !item.isVegetarian && !item.isVegan && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500">
                                                    Nenhuma
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#DEB887] text-[#8B4513] hover:bg-[#FAEBD7]"
                                                asChild
                                            >
                                                <a href={`/admin/menu/${item.id}`}>
                                                    Editar
                                                </a>
                                            </Button>
                                            <DeleteMenuItem id={item.id} name={item.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {menuItems.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center">
                                        <div className="space-y-2">
                                            <p className="text-[#8B4513] font-medium">Nenhum item encontrado no cardápio</p>
                                            <p className="text-[#D2691E] text-sm">
                                                Comece adicionando um novo item ao cardápio
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