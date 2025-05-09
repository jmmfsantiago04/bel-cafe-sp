'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateMenuItem, type MenuItemFormData } from "@/app/actions/menu"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    description: z.string().optional().nullable(),
    price: z.number().min(0, {
        message: "O preço deve ser maior que zero.",
    }),
    imageUrl: z.string().url({
        message: "Digite uma URL válida para a imagem.",
    }).optional().nullable(),
    isSalgado: z.boolean(),
    isDoce: z.boolean(),
    isCafeDaManha: z.boolean(),
    isAlmoco: z.boolean(),
    isJantar: z.boolean(),
    isSobremesa: z.boolean(),
    isSugarFree: z.boolean(),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    hasSize: z.boolean(),
    mediumSizePrice: z.number().min(0).optional().nullable(),
    largeSizePrice: z.number().min(0).optional().nullable(),
    isGlutenFree: z.boolean(),
    isVegetarian: z.boolean(),
    isVegan: z.boolean(),
}) satisfies z.ZodType<MenuItemFormData>

type FormData = z.infer<typeof formSchema>

interface EditMenuItemFormProps {
    menuItem: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isSalgado: boolean;
        isDoce: boolean;
        isCafeDaManha: boolean;
        isAlmoco: boolean;
        isJantar: boolean;
        isSobremesa: boolean;
        isSugarFree: boolean;
        isAvailable: boolean;
        isPopular: boolean;
        hasSize: boolean;
        mediumSizePrice: number | null;
        largeSizePrice: number | null;
        isGlutenFree: boolean;
        isVegetarian: boolean;
        isVegan: boolean;
    };
    onSuccess?: () => void;
}

export function EditMenuItemForm({
    menuItem,
    onSuccess,
}: EditMenuItemFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: menuItem.name,
            description: menuItem.description,
            price: menuItem.price,
            imageUrl: menuItem.imageUrl,
            isSalgado: menuItem.isSalgado,
            isDoce: menuItem.isDoce,
            isCafeDaManha: menuItem.isCafeDaManha,
            isAlmoco: menuItem.isAlmoco,
            isJantar: menuItem.isJantar,
            isSobremesa: menuItem.isSobremesa,
            isSugarFree: menuItem.isSugarFree,
            isAvailable: menuItem.isAvailable,
            isPopular: menuItem.isPopular,
            hasSize: menuItem.hasSize,
            mediumSizePrice: menuItem.mediumSizePrice,
            largeSizePrice: menuItem.largeSizePrice,
            isGlutenFree: menuItem.isGlutenFree,
            isVegetarian: menuItem.isVegetarian,
            isVegan: menuItem.isVegan,
        },
    })

    const hasSize = form.watch("hasSize")

    async function onSubmit(values: FormData) {
        try {
            setIsSubmitting(true)

            const result = await updateMenuItem(menuItem.id, values)

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Item atualizado com sucesso!", {
                description: "As alterações foram salvas.",
            })

            onSuccess?.()
        } catch (error) {
            toast.error("Erro ao atualizar item", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#4A2512] font-semibold">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome do item"
                                            {...field}
                                            className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-700" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#4A2512] font-semibold">Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição do item"
                                            className="resize-none bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2 h-20"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-red-700" />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#4A2512] font-semibold">Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-700" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#4A2512] font-semibold">URL da Imagem</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://..."
                                                className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-red-700" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#4A2512] mb-2">Categorias</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="isCafeDaManha"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Café da Manhã</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isAlmoco"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Almoço</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isJantar"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Jantar</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSobremesa"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Sobremesa</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSalgado"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Salgado</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isDoce"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Doce</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Dietary Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#4A2512] mb-2">Informações Nutricionais</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="isGlutenFree"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Sem Glúten</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSugarFree"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Sem Açúcar</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isVegetarian"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Vegetariano</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isVegan"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Vegano</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div>
                            <h3 className="text-lg font-semibold text-[#4A2512] mb-2">Opções Adicionais</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Disponível</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isPopular"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Popular</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hasSize"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Tem Tamanhos</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Size Options */}
                        {hasSize && (
                            <div className="space-y-2">
                                <FormField
                                    control={form.control}
                                    name="mediumSizePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#4A2512] font-semibold">Preço Tamanho Médio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-700" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="largeSizePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#4A2512] font-semibold">Preço Tamanho Grande</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-red-700" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#8B4513] hover:bg-[#4A2512] text-white font-semibold shadow-md transition-colors mt-6"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Atualizando item..." : "Atualizar Item"}
                </Button>
            </form>
        </Form>
    )
} 