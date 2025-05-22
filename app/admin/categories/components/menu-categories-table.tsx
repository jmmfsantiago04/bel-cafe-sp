'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { MenuCategoryFormData, updateCategory, deleteCategory, getCategories } from "@/app/actions/categories"
import { Plus, UtensilsCrossed, Coffee, Pencil, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMenuCategories, type MenuCategory } from "./menu-categories-context"
import { MenuCategoryForm } from "./menu-category-form"

interface MenuCategoriesTableProps {
    initialCategories: MenuCategory[]
}

export function MenuCategoriesTable({ initialCategories }: MenuCategoriesTableProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const { categories, setCategories, updateCategory: updateContextCategory, deleteCategory: deleteContextCategory } = useMenuCategories()
    const [selectedCategory, setSelectedCategory] = useState<MenuCategory | null>(null)

    useEffect(() => {
        setCategories(initialCategories)
    }, [initialCategories, setCategories])

    async function handleSubmit(values: MenuCategoryFormData) {
        try {
            const result = await updateCategory(values)
            if (result.success) {
                if (selectedCategory) {
                    toast.success("Categoria atualizada com sucesso!")
                    updateContextCategory({ ...selectedCategory, ...values })
                } else {
                    toast.success("Categoria criada com sucesso!")
                    const updatedCategories = await getCategories()
                    if (updatedCategories.success && updatedCategories.data) {
                        setCategories(updatedCategories.data as MenuCategory[])
                    }
                }
                setIsDialogOpen(false)
            } else {
                toast.error("Erro ao salvar categoria")
            }
        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar categoria")
        }
    }

    async function handleDelete(id: number) {
        try {
            await deleteCategory(id)
            toast.success("Categoria excluída com sucesso!")
            deleteContextCategory(id)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir categoria")
        }
    }

    function handleEdit(category: MenuCategory) {
        setSelectedCategory(category)
        setIsDialogOpen(true)
    }

    function handleAdd() {
        setSelectedCategory(null)
        setIsDialogOpen(true)
    }

    async function handleToggle(category: MenuCategory) {
        try {
            const updatedCategory = { ...category, isActive: !category.isActive }
            await updateCategory(updatedCategory)
            toast.success("Status da categoria atualizado com sucesso!")
            updateContextCategory(updatedCategory)
        } catch (error) {
            console.error(error)
            toast.error("Erro ao atualizar status da categoria")
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Categorias do Menu</CardTitle>
                        <CardDescription>
                            Gerencie as categorias do menu e bebidas
                        </CardDescription>
                    </div>
                    <Button onClick={handleAdd} className="bg-[#8B4513] hover:bg-[#4A2512]">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Categoria
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {selectedCategory ? "Editar Categoria" : "Nova Categoria"}
                            </DialogTitle>
                        </DialogHeader>
                        <MenuCategoryForm
                            selectedCategory={selectedCategory}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Ordem</TableHead>
                            <TableHead>Flag</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    {category.type === "menu" ? (
                                        <UtensilsCrossed className="h-4 w-4 text-[#8B4513]" />
                                    ) : (
                                        <Coffee className="h-4 w-4 text-[#8B4513]" />
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                    {category.type === "menu" ? "Menu" : "Bebidas"}
                                </TableCell>
                                <TableCell>{category.displayOrder}</TableCell>
                                <TableCell>{category.flag}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={category.isActive}
                                        onCheckedChange={() => handleToggle(category)}
                                        aria-label={`${category.isActive ? "Desativar" : "Ativar"} categoria ${category.name}`}
                                    />
                                </TableCell>
                                <TableCell className="text-right space-x-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleEdit(category)}
                                        className="hover:text-[#8B4513]"
                                    >
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Editar {category.name}</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => category.id && handleDelete(category.id)}
                                        className="hover:text-red-500"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Excluir {category.name}</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                                    Nenhuma categoria encontrada
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
} 