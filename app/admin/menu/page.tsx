import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getMenuItems } from "@/app/actions/menu"
import { DeleteMenuItem } from "@/components/admin/delete-menu-item"
import { MenuItemForm } from "@/components/admin/menu-form"
import { DrinkForm } from "@/components/menu/drink-form"
import { Coffee, Plus } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { getCategories } from "@/app/actions/categories"

export default async function MenuPage() {
    const { data: menuItems, error: menuError } = await getMenuItems();
    const { data: categories, error: categoriesError } = await getCategories();

    if (menuError || categoriesError || !categories || !menuItems) {
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
                        {menuError || categoriesError || "Erro ao carregar dados"}
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
                <div className="flex gap-3">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Adicionar Item
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                                    Novo Item do Cardápio
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <MenuItemForm categories={categories} />
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                                <Coffee className="w-4 h-4 mr-2" />
                                Adicionar Bebida
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                                    Nova Bebida
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <DrinkForm />
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
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
                                    <td className="px-6 py-4">{item.categoryId}</td>
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
                                    <td colSpan={7} className="px-6 py-8 text-center">
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