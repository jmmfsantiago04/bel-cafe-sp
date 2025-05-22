'use client'

import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MenuCategory } from "./menu-categories-context"

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

interface MenuCategoryFormProps {
    selectedCategory: MenuCategory | null
    onSubmit: (values: FormData) => Promise<void>
    onCancel: () => void
}

export function MenuCategoryForm({ selectedCategory, onSubmit, onCancel }: MenuCategoryFormProps) {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: selectedCategory?.name ?? "",
            type: selectedCategory?.type ?? "menu",
            slug: selectedCategory?.slug ?? "",
            flag: selectedCategory?.flag ?? "",
            displayOrder: typeof selectedCategory?.displayOrder === 'number' ? selectedCategory.displayOrder : 0,
            isActive: selectedCategory?.isActive ?? true,
            id: selectedCategory?.id,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                                    value={field.value || 0}
                                    onChange={(e) => {
                                        const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                        field.onChange(value)
                                    }}
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
                        onClick={onCancel}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" className="bg-[#8B4513] hover:bg-[#4A2512]">
                        Salvar
                    </Button>
                </div>
            </form>
        </Form>
    )
} 