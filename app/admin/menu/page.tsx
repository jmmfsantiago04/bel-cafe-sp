'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddMenuItemForm } from "@/components/admin/add-menu-item-form"
import { DrinkForm } from "@/components/admin/drink-form"
import { EditMenuItemForm } from "@/components/admin/edit-menu-item-form"
import { EditDrinkForm } from "@/components/admin/edit-drink-form"
import { Plus } from "lucide-react"
import { MenuItemsTable, type MenuItem } from "../../../components/admin/menu-items-table"
import { toast } from "sonner"
import { deleteDrink, updateDrink, getAllDrinks } from "@/app/actions/drinks"
import { deleteMenuItem, updateMenuItem, getMenuItems } from "@/app/actions/menu"

export default function MenuPage() {
    const [itemDialogOpen, setItemDialogOpen] = useState(false)
    const [drinkDialogOpen, setDrinkDialogOpen] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
    const [items, setItems] = useState<MenuItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchAllItems = async () => {
        try {
            setIsLoading(true)

            // Fetch menu items using server actions
            const [menuItemsResult, drinksResult] = await Promise.all([
                getMenuItems(),
                getAllDrinks()
            ])

            const menuItemsData = ('data' in menuItemsResult && Array.isArray(menuItemsResult.data))
                ? menuItemsResult.data
                : []
            const drinksData = Array.isArray(drinksResult) ? drinksResult : []

            // Transform drinks to match menu item format
            const formattedDrinks = drinksData.map(drink => ({
                id: drink.id,
                name: drink.name,
                description: drink.description,
                price: drink.price,
                imageUrl: drink.imageUrl,
                isAvailable: drink.isAvailable,
                isPopular: drink.isPopular,
                isHotDrink: drink.isHotDrink,
                isColdDrink: !drink.isHotDrink,
                // Additional menu item fields set to false for drinks
                isSalgado: false,
                isDoce: false,
                isCafeDaManha: false,
                isAlmoco: false,
                isJantar: false,
                isSobremesa: false,
            }))

            // Transform menu items to ensure all fields are present
            const formattedMenuItems = menuItemsData.map(item => ({
                id: item.id,
                name: item.name,
                description: item.description,
                price: item.price,
                imageUrl: item.imageUrl,
                isAvailable: item.isAvailable,
                isPopular: item.isPopular,
                isSalgado: item.isSalgado,
                isDoce: item.isDoce,
                isCafeDaManha: item.isCafeDaManha,
                isAlmoco: item.isAlmoco,
                isJantar: item.isJantar,
                isSobremesa: item.isSobremesa,
            }))

            // Combine all items
            setItems([...formattedMenuItems, ...formattedDrinks])
        } catch (error) {
            console.error('Error fetching items:', error)
            toast.error("Erro ao carregar itens", {
                description: "Não foi possível carregar os itens do cardápio."
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAllItems()
    }, [])

    const handleEditItem = (item: MenuItem) => {
        setEditingItem(item)
        setEditDialogOpen(true)
    }

    const handleDeleteItem = async (item: MenuItem) => {
        try {
            const itemId = typeof item.id === 'string' ? parseInt(item.id) : item.id

            let result;
            if ('isHotDrink' in item) {
                // Delete drink
                result = await deleteDrink(itemId)
            } else {
                // Delete menu item
                result = await deleteMenuItem(itemId)
            }

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Item removido com sucesso")
            fetchAllItems() // Refresh the list
        } catch (error) {
            console.error('Error deleting item:', error)
            toast.error("Erro ao remover item", {
                description: "Não foi possível remover o item do cardápio."
            })
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] p-6 flex flex-col bg-[#FDF5E6]/30">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#8B4513] font-serif">Cardápio</h1>
                    <p className="text-[#D2691E] text-sm mt-1">Gerencie os itens do cardápio</p>
                </div>

                <div className="flex gap-3">
                    <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Novo Item do Cardápio</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes do novo item do cardápio abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <AddMenuItemForm onSuccess={() => {
                                setItemDialogOpen(false)
                                fetchAllItems()
                            }} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={drinkDialogOpen} onOpenChange={setDrinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Bebida
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Nova Bebida</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes da nova bebida abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <DrinkForm onSuccess={() => {
                                setDrinkDialogOpen(false)
                                fetchAllItems()
                            }} />
                        </DialogContent>
                    </Dialog>

                    {/* Edit Dialog */}
                    <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">
                                    {editingItem?.isHotDrink !== undefined
                                        ? "Editar Bebida"
                                        : "Editar Item do Cardápio"
                                    }
                                </DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Atualize os detalhes do item abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            {editingItem && (
                                editingItem.isHotDrink !== undefined ? (
                                    <EditDrinkForm
                                        drink={{
                                            id: typeof editingItem.id === 'string' ? parseInt(editingItem.id) : editingItem.id,
                                            name: editingItem.name,
                                            description: editingItem.description,
                                            price: typeof editingItem.price === 'string' ? parseFloat(editingItem.price) : editingItem.price,
                                            imageUrl: editingItem.imageUrl,
                                            isHotDrink: editingItem.isHotDrink,
                                            isAvailable: editingItem.isAvailable,
                                            isPopular: editingItem.isPopular,
                                            isAlcoholic: false,
                                            hasSize: false,
                                            mediumSizePrice: null,
                                            largeSizePrice: null,
                                            isGlutenFree: false,
                                            isVegetarian: false,
                                            isVegan: false,
                                        }}
                                        onSuccess={() => {
                                            setEditDialogOpen(false)
                                            setEditingItem(null)
                                            fetchAllItems()
                                        }}
                                    />
                                ) : (
                                    <EditMenuItemForm
                                        menuItem={{
                                            id: typeof editingItem.id === 'string' ? parseInt(editingItem.id) : editingItem.id,
                                            name: editingItem.name,
                                            description: editingItem.description,
                                            price: typeof editingItem.price === 'string' ? parseFloat(editingItem.price) : editingItem.price,
                                            imageUrl: editingItem.imageUrl,
                                            isSalgado: editingItem.isSalgado || false,
                                            isDoce: editingItem.isDoce || false,
                                            isCafeDaManha: editingItem.isCafeDaManha || false,
                                            isAlmoco: editingItem.isAlmoco || false,
                                            isJantar: editingItem.isJantar || false,
                                            isSobremesa: editingItem.isSobremesa || false,
                                            isSugarFree: false,
                                            isAvailable: editingItem.isAvailable,
                                            isPopular: editingItem.isPopular,
                                            hasSize: false,
                                            mediumSizePrice: null,
                                            largeSizePrice: null,
                                            isGlutenFree: false,
                                            isVegetarian: false,
                                            isVegan: false,
                                        }}
                                        onSuccess={() => {
                                            setEditDialogOpen(false)
                                            setEditingItem(null)
                                            fetchAllItems()
                                        }}
                                    />
                                )
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513]"></div>
                            <p className="text-[#8B4513]">Carregando itens...</p>
                        </div>
                    </div>
                ) : (
                    <MenuItemsTable
                        items={items}
                        onEdit={handleEditItem}
                        onDelete={handleDeleteItem}
                    />
                )}
            </div>
        </div>
    )
} 