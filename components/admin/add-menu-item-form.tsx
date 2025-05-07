'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createMenuItem, type MenuItemFormData } from "@/app/actions/menu"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription,
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

export function AddMenuItemForm({
    onSuccess,
}: {
    onSuccess?: () => void
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: null,
            price: 0,
            imageUrl: null,
            isSalgado: false,
            isDoce: false,
            isCafeDaManha: false,
            isAlmoco: false,
            isJantar: false,
            isSobremesa: false,
            isSugarFree: false,
            isAvailable: true,
            isPopular: false,
            hasSize: false,
            mediumSizePrice: null,
            largeSizePrice: null,
            isGlutenFree: false,
            isVegetarian: false,
            isVegan: false,
        },
    })

    const hasSize = form.watch("hasSize")

    async function onSubmit(values: FormData) {
        try {
            setIsSubmitting(true)

            const result = await createMenuItem(values)

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Item adicionado com sucesso!", {
                description: "O item foi adicionado ao cardápio.",
            })

            form.reset()
            onSuccess?.()
        } catch (error) {
            toast.error("Erro ao adicionar item", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Information */}
                    <div className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#F5E6D3]">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome do item"
                                            {...field}
                                            className="bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#FFB800]" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#F5E6D3]">Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição do item"
                                            className="resize-none bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#FFB800]" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#F5E6D3]">Preço</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            placeholder="0.00"
                                            className="bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#FFB800]" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#F5E6D3]">URL da Imagem</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://exemplo.com/imagem.jpg"
                                            className="bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="text-[#FFB800]" />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Categories */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#FFB800]">Categorias</h3>
                            <FormField
                                control={form.control}
                                name="isCafeDaManha"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Café da Manhã</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Almoço</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Jantar</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Sobremesa</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Salgado</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Doce</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Dietary Information */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#FFB800]">Informações Nutricionais</h3>
                            <FormField
                                control={form.control}
                                name="isGlutenFree"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Sem Glúten</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Sem Açúcar</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Vegetariano</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Vegano</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Additional Options */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-[#FFB800]">Opções Adicionais</h3>
                            <FormField
                                control={form.control}
                                name="isAvailable"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Disponível</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Popular</FormLabel>
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
                                                className="border-[#F5E6D3] data-[state=checked]:bg-[#E67E22] data-[state=checked]:border-[#E67E22]"
                                            />
                                        </FormControl>
                                        <FormLabel className="text-[#F5E6D3]">Tem Tamanhos</FormLabel>
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Size Options */}
                        {hasSize && (
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="mediumSizePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#F5E6D3]">Preço Tamanho Médio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#FFB800]" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="largeSizePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#F5E6D3]">Preço Tamanho Grande</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="bg-[#2D4F56] border-[#F5E6D3]/20 text-[#F5E6D3] placeholder:text-[#F5E6D3]/50"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-[#FFB800]" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#2D4F56] hover:bg-[#1D3F46] text-[#F5E6D3]"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adicionando item..." : "Adicionar Item"}
                </Button>
            </form>
        </Form>
    )
} 