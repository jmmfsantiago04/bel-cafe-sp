'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { MenuCategoryFormData, updateCategory, deleteCategory } from "@/app/actions/categories"
import { zodResolver } from "@hookform/resolvers/zod"
import { Pencil, Plus, Trash2, UtensilsCrossed, Coffee } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useMenuCategories, type MenuCategory } from "@/components/menu/menu-categories-context"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.enum(["menu", "drink"]),
    slug: z.string().min(1, "Slug é obrigatório"),
    flag: z.string().min(1, "Flag é obrigatória"),
    displayOrder: z.number().min(0),
    isActive: z.boolean(),
    id: z.number().optional(),
})

type FormData = z.infer<typeof formSchema>

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

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "menu",
            slug: "",
            flag: "",
            displayOrder: 0,
            isActive: true,
        },
    })

    async function onSubmit(values: FormData) {
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
                        setCategories(updatedCategories.data)
                    }
                }
                setIsDialogOpen(false)
                form.reset()
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
        form.reset(category)
        setIsDialogOpen(true)
    }

    function handleAdd() {
        setSelectedCategory(null)
        form.reset({
            name: "",
            type: "menu",
            slug: "",
            flag: "",
            displayOrder: categories.length,
            isActive: true,
        })
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
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nome</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Café da Manhã" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: cafe-da-manha" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecione o tipo" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="menu">Menu</SelectItem>
                                                    <SelectItem value="drink">Bebida</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="flag"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Flag</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: isCafeDaManha" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="displayOrder"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ordem de Exibição</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    {...field}
                                                    onChange={e => field.onChange(parseInt(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="isActive"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel>Ativo</FormLabel>
                                                <CardDescription>
                                                    Determina se esta categoria está visível
                                                </CardDescription>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />

                                <div className="flex justify-end gap-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-[#8B4513] hover:bg-[#4A2512]">
                                        Salvar
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]"></TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead className="text-right">Status</TableHead>
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
                                <TableCell className="text-right">
                                    <Switch
                                        checked={category.isActive}
                                        onCheckedChange={() => handleToggle(category)}
                                        aria-label={`${category.isActive ? "Desativar" : "Ativar"} categoria ${category.name}`}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {categories.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
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