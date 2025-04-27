import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { getMenuItems } from "@/app/actions/menu"
import { DeleteMenuItem } from "@/components/admin/delete-menu-item"

export default async function MenuPage() {
    const { data: menuItems, error } = await getMenuItems();

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-[#8B4513]">Cardápio</h1>
                    <Link href="/menu">
                        <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                            Adicionar Item
                        </Button>
                    </Link>
                </div>
                <Card className="p-6 bg-white shadow-lg">
                    <p className="text-red-600">
                        {error}
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#8B4513]">Cardápio</h1>
                <Link href="/menu">
                    <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                        Adicionar Item
                    </Button>
                </Link>
            </div>

            <Card className="bg-white shadow-lg">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAEBD7] border-b border-[#DEB887]">
                            <tr>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Nome</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Categoria</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Preço Base</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Tamanhos</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Status</th>
                                <th className="text-left p-4 text-[#8B4513] font-semibold">Popular</th>
                                <th className="text-right p-4 text-[#8B4513] font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEB887]">
                            {menuItems.map((item) => (
                                <tr key={item.id} className="hover:bg-[#FDF5E6]">
                                    <td className="p-4">{item.name}</td>
                                    <td className="p-4">{item.categoryId}</td>
                                    <td className="p-4">R$ {Number(item.price).toFixed(2)}</td>
                                    <td className="p-4">
                                        {item.hasSize ? (
                                            <div className="text-sm">
                                                <div>M: R$ {item.mediumSizePrice ? Number(item.mediumSizePrice).toFixed(2) : "N/A"}</div>
                                                <div>G: R$ {item.largeSizePrice ? Number(item.largeSizePrice).toFixed(2) : "N/A"}</div>
                                            </div>
                                        ) : (
                                            "N/A"
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                            }`}>
                                            {item.isAvailable ? "Disponível" : "Indisponível"}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${item.isPopular
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-gray-100 text-gray-800"
                                            }`}>
                                            {item.isPopular ? "Popular" : "Normal"}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-[#DEB887] text-[#8B4513] hover:bg-[#FAEBD7]"
                                                asChild
                                            >
                                                <Link href={`/menu/${item.id}`}>
                                                    Editar
                                                </Link>
                                            </Button>
                                            <DeleteMenuItem id={item.id} name={item.name} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {menuItems.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        Nenhum item encontrado no cardápio
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