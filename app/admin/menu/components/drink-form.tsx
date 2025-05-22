'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { createDrink, type DrinkFormData } from "@/app/actions/drinks"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().nullable(),
    price: z.coerce.number().min(0, "Preço deve ser maior ou igual a 0"),
    imageUrl: z.string().nullable(),
    isHotDrink: z.boolean(),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    isAlcoholic: z.boolean(),
    hasSize: z.boolean(),
    mediumSizePrice: z.coerce.number().nullable(),
    largeSizePrice: z.coerce.number().nullable(),
    isGlutenFree: z.boolean(),
    isVegetarian: z.boolean(),
    isVegan: z.boolean(),
}).superRefine((data, ctx) => {
    if (data.hasSize) {
        if (!data.mediumSizePrice && !data.largeSizePrice) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Pelo menos um tamanho deve ter preço quando o item tem opções de tamanho",
                path: ["mediumSizePrice"],
            });
        }
    }
});

type FormData = z.infer<typeof formSchema>;

export function DrinkForm({
    onSuccess,
}: {
    onSuccess?: () => void
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: null,
            price: 0,
            imageUrl: null,
            isHotDrink: true,
            isAvailable: true,
            isPopular: false,
            isAlcoholic: false,
            hasSize: true,
            mediumSizePrice: null,
            largeSizePrice: null,
            isGlutenFree: false,
            isVegetarian: false,
            isVegan: false,
        },
    });

    const hasSize = form.watch("hasSize");

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true);
            const result = await createDrink(data as DrinkFormData);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Sucesso", {
                description: "Bebida adicionada ao cardápio",
            });
            form.reset();
            onSuccess?.();
            router.refresh();
        } catch (error) {
            toast.error("Erro", {
                description: error instanceof Error ? error.message : "Algo deu errado ao criar a bebida",
            });
        } finally {
            setIsLoading(false);
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
                                    <FormLabel className="form-label">Nome da Bebida</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Café Expresso"
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
                                            placeholder="Descreva a bebida..."
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
                                        <FormLabel className="form-label">Preço Base (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="form-input"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
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

                    {/* Drink Type and Size Options */}
                    <div className="form-section">
                        <div>
                            <h3 className="form-section-title">Tipo de Bebida</h3>
                            <div className="form-section-grid">
                                <FormField
                                    control={form.control}
                                    name="isHotDrink"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <FormLabel className="form-checkbox-label">Bebida Quente</FormLabel>
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
                                            <FormLabel className="form-checkbox-label">Possui Tamanhos</FormLabel>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {hasSize && (
                                <div className="space-y-2 mt-2">
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
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
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
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="form-error-message" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
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
                            <h3 className="form-section-title">Status</h3>
                            <div className="form-section-grid">
                                <FormField
                                    control={form.control}
                                    name="isAlcoholic"
                                    render={({ field }) => (
                                        <FormItem className="form-checkbox-container">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="form-checkbox"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="form-checkbox-label">Bebida Alcoólica (18+)</FormLabel>
                                                <FormDescription className="form-description">
                                                    Marque se esta bebida contém álcool
                                                </FormDescription>
                                            </div>
                                        </FormItem>
                                    )}
                                />

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
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="form-submit-button"
                    disabled={isLoading}
                >
                    {isLoading ? "Adicionando bebida..." : "Adicionar Bebida"}
                </Button>
            </form>
        </Form>
    )
} 