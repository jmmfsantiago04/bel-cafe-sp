'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { updateDrink, type DrinkFormData } from "@/app/actions/drinks"
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
    description: z.string().nullable(),
    price: z.number().min(0, {
        message: "O preço deve ser maior que zero.",
    }),
    imageUrl: z.string().url({
        message: "Digite uma URL válida para a imagem.",
    }).nullable(),
    isHotDrink: z.boolean(),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    isAlcoholic: z.boolean(),
    hasSize: z.boolean(),
    mediumSizePrice: z.number().min(0).nullable(),
    largeSizePrice: z.number().min(0).nullable(),
    isGlutenFree: z.boolean(),
    isVegetarian: z.boolean(),
    isVegan: z.boolean(),
}) satisfies z.ZodType<DrinkFormData>

type FormData = z.infer<typeof formSchema>

interface EditDrinkFormProps {
    drink: {
        id: number;
        name: string;
        description: string | null;
        price: number;
        imageUrl: string | null;
        isHotDrink: boolean;
        isAvailable: boolean;
        isPopular: boolean;
        isAlcoholic: boolean;
        hasSize: boolean;
        mediumSizePrice: number | null;
        largeSizePrice: number | null;
        isGlutenFree: boolean;
        isVegetarian: boolean;
        isVegan: boolean;
    };
    onSuccess?: () => void;
}

export function EditDrinkForm({
    drink,
    onSuccess,
}: EditDrinkFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: drink.name,
            description: drink.description,
            price: drink.price,
            imageUrl: drink.imageUrl,
            isHotDrink: drink.isHotDrink,
            isAvailable: drink.isAvailable,
            isPopular: drink.isPopular,
            isAlcoholic: drink.isAlcoholic,
            hasSize: drink.hasSize,
            mediumSizePrice: drink.mediumSizePrice,
            largeSizePrice: drink.largeSizePrice,
            isGlutenFree: drink.isGlutenFree,
            isVegetarian: drink.isVegetarian,
            isVegan: drink.isVegan,
        },
    });

    const hasSize = form.watch("hasSize");

    async function onSubmit(data: FormData) {
        try {
            setIsSubmitting(true);
            const result = await updateDrink(drink.id, data);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Sucesso", {
                description: "Bebida atualizada com sucesso",
            });
            onSuccess?.();
            router.refresh();
        } catch (error) {
            toast.error("Erro", {
                description: error instanceof Error ? error.message : "Algo deu errado ao atualizar a bebida",
            });
        } finally {
            setIsSubmitting(false);
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
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Atualizando bebida..." : "Atualizar Bebida"}
                </Button>
            </form>
        </Form>
    )
} 