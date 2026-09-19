'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { AddMenuItemForm } from "@/app/admin/menu/components/add-menu-item-form"
import { DrinkForm } from "@/app/admin/menu/components/drink-form"
import { EditMenuItemForm } from "@/app/admin/menu/components/edit-menu-item-form"
import { EditDrinkForm } from "@/app/admin/menu/components/edit-drink-form"
import { MenuItemsTable, type MenuItem } from "@/app/admin/menu/components/menu-items-table"
import { deleteMenuItem } from "@/app/actions/menu"
import { deleteDrink } from "@/app/actions/drinks"

export type AdminMenuItem = MenuItem & {
    kind: "menu" | "drink"
    isSugarFree?: boolean
    isAlcoholic?: boolean
    hasSize?: boolean
    mediumSizePrice?: number | null
    largeSizePrice?: number | null
    isGlutenFree?: boolean
    isVegetarian?: boolean
    isVegan?: boolean
}

type MenuAdminClientProps = {
    items: AdminMenuItem[]
}

export function MenuAdminClient({ items }: MenuAdminClientProps) {
    const router = useRouter()
    const [editingItem, setEditingItem] = useState<AdminMenuItem | null>(null)
    const [deletingItem, setDeletingItem] = useState<AdminMenuItem | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const refresh = () => router.refresh()

    const handleDelete = async () => {
        if (!deletingItem) return
        setIsDeleting(true)
        try {
            const result =
                deletingItem.kind === "drink"
                    ? await deleteDrink(Number(deletingItem.id))
                    : await deleteMenuItem(Number(deletingItem.id))

            if (result && "error" in result && result.error) {
                throw new Error(result.error)
            }

            toast.success("Item removido", {
                description: `"${deletingItem.name}" foi excluído do cardápio.`,
            })
            setDeletingItem(null)
            refresh()
        } catch (error) {
            toast.error("Erro ao excluir", {
                description: error instanceof Error ? error.message : "Tente novamente.",
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="h-[calc(100vh-4rem)] p-6 flex flex-col bg-[#FDF5E6]/30">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#8B4513] font-serif">Cardápio</h1>
                    <p className="text-[#D2691E] text-sm mt-1">Gerencie os itens do cardápio</p>
                </div>

                <div className="flex gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20 w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Novo Item do Cardápio</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes do novo item do cardápio abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <AddMenuItemForm onSuccess={refresh} />
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Bebida
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20 w-[95vw] sm:w-auto max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Nova Bebida</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes da nova bebida abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <DrinkForm onSuccess={refresh} />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <MenuItemsTable
                    items={items}
                    onEdit={(item) => setEditingItem(item as AdminMenuItem)}
                    onDelete={(item) => setDeletingItem(item as AdminMenuItem)}
                />
            </div>

            <Dialog
                open={editingItem !== null && editingItem.kind === "menu"}
                onOpenChange={(open) => {
                    if (!open) setEditingItem(null)
                }}
            >
                <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20 max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#8B4513]">Editar Item</DialogTitle>
                        <DialogDescription className="text-[#D2691E]">
                            Atualize os detalhes do item do cardápio.
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem?.kind === "menu" && (
                        <EditMenuItemForm
                            menuItem={{
                                id: Number(editingItem.id),
                                name: editingItem.name,
                                description: editingItem.description,
                                price: Number(editingItem.price),
                                imageUrl: editingItem.imageUrl,
                                isSalgado: !!editingItem.isSalgado,
                                isDoce: !!editingItem.isDoce,
                                isCafeDaManha: !!editingItem.isCafeDaManha,
                                isAlmoco: !!editingItem.isAlmoco,
                                isJantar: !!editingItem.isJantar,
                                isSobremesa: !!editingItem.isSobremesa,
                                isSugarFree: !!editingItem.isSugarFree,
                                isAvailable: editingItem.isAvailable,
                                isPopular: editingItem.isPopular,
                                hasSize: !!editingItem.hasSize,
                                mediumSizePrice:
                                    editingItem.mediumSizePrice != null
                                        ? Number(editingItem.mediumSizePrice)
                                        : null,
                                largeSizePrice:
                                    editingItem.largeSizePrice != null
                                        ? Number(editingItem.largeSizePrice)
                                        : null,
                                isGlutenFree: !!editingItem.isGlutenFree,
                                isVegetarian: !!editingItem.isVegetarian,
                                isVegan: !!editingItem.isVegan,
                            }}
                            onSuccess={() => {
                                setEditingItem(null)
                                refresh()
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Dialog
                open={editingItem !== null && editingItem.kind === "drink"}
                onOpenChange={(open) => {
                    if (!open) setEditingItem(null)
                }}
            >
                <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20 max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
                    <DialogHeader>
                        <DialogTitle className="text-[#8B4513]">Editar Bebida</DialogTitle>
                        <DialogDescription className="text-[#D2691E]">
                            Atualize os detalhes da bebida.
                        </DialogDescription>
                    </DialogHeader>
                    {editingItem?.kind === "drink" && (
                        <EditDrinkForm
                            drink={{
                                id: Number(editingItem.id),
                                name: editingItem.name,
                                description: editingItem.description,
                                price: Number(editingItem.price),
                                imageUrl: editingItem.imageUrl,
                                isHotDrink: !!editingItem.isHotDrink,
                                isAvailable: editingItem.isAvailable,
                                isPopular: editingItem.isPopular,
                                isAlcoholic: !!editingItem.isAlcoholic,
                                hasSize: !!editingItem.hasSize,
                                mediumSizePrice:
                                    editingItem.mediumSizePrice != null
                                        ? Number(editingItem.mediumSizePrice)
                                        : null,
                                largeSizePrice:
                                    editingItem.largeSizePrice != null
                                        ? Number(editingItem.largeSizePrice)
                                        : null,
                                isGlutenFree: !!editingItem.isGlutenFree,
                                isVegetarian: !!editingItem.isVegetarian,
                                isVegan: !!editingItem.isVegan,
                            }}
                            onSuccess={() => {
                                setEditingItem(null)
                                refresh()
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <AlertDialog
                open={deletingItem !== null}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) setDeletingItem(null)
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Excluir item?</AlertDialogTitle>
                        <AlertDialogDescription>
                            {deletingItem
                                ? `Isso remove "${deletingItem.name}" do cardápio. Esta ação não pode ser desfeita.`
                                : null}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                void handleDelete()
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? "Excluindo…" : "Excluir"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}