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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="form-grid-container">
                    {/* Basic Information */}
                    <div className="form-section">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label">Nome</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome do item"
                                            {...field}
                                            className="form-input"
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-message" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="form-label">Descrição</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Descrição do item"
                                            className="form-textarea"
                                            {...field}
                                            value={field.value || ""}
                                        />
                                    </FormControl>
                                    <FormMessage className="form-error-message" />
                                </FormItem>
                            )}
                        />

                        <div className="form-section-grid">
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label">Preço</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="form-input"
                                                {...field}
                                                onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-message" />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="form-label">URL da Imagem</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://..."
                                                className="form-input"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormMessage className="form-error-message" />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="form-section">
                        <div>
                            <h3 className="form-section-title">Categorias</h3>
                            <div className="form-section-grid">
                                <FormField
                                    control={form.control}
                                    name="isCafeDaManha"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Café da Manhã</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isAlmoco"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Almoço</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isJantar"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Jantar</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSobremesa"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Sobremesa</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSalgado"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Salgado</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isDoce"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Doce</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Dietary Information */}
                        <div>
                            <h3 className="form-section-title">Informações Nutricionais</h3>
                            <div className="form-section-grid">
                                <FormField
                                    control={form.control}
                                    name="isGlutenFree"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Sem Glúten</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isSugarFree"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Sem Açúcar</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isVegetarian"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Vegetariano</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isVegan"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Vegano</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Additional Options */}
                        <div>
                            <h3 className="form-section-title">Opções Adicionais</h3>
                            <div className="form-section-grid">
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Disponível</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="isPopular"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Popular</FormLabel>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="hasSize"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Tem Tamanhos</FormLabel>
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
                                            <FormLabel className="form-label">Preço Tamanho Médio</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="form-input"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-error-message" />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="largeSizePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="form-label">Preço Tamanho Grande</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    placeholder="0.00"
                                                    className="form-input"
                                                    {...field}
                                                    value={field.value || ""}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage className="form-error-message" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    type="submit"
                    className="form-submit-button"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Adicionando item..." : "Adicionar Item"}
                </Button>
            </form>
        </Form>
    )
} 