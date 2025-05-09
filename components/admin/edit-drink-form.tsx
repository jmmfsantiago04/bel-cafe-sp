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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#4A2512] font-semibold">Nome da Bebida</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Café Expresso"
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
                                            placeholder="Descreva a bebida..."
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
                                        <FormLabel className="text-[#4A2512] font-semibold">Preço Base (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                placeholder="0.00"
                                                className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
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

                    {/* Drink Type and Size Options */}
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-[#4A2512] mb-2">Tipo de Bebida</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="isHotDrink"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Bebida Quente</FormLabel>
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
                                            <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Possui Tamanhos</FormLabel>
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
                                                <FormLabel className="text-[#4A2512] font-semibold">Preço Tamanho Médio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        min="0"
                                                        placeholder="0.00"
                                                        className="bg-[#FFF8F0] border-[#8B4513] text-[#4A2512] placeholder:text-[#8B4513]/60 focus-visible:ring-[#8B4513] focus-visible:ring-offset-2"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
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
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-700" />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
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
                            <h3 className="text-lg font-semibold text-[#4A2512] mb-2">Status</h3>
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="isAlcoholic"
                                    render={({ field }) => (
                                        <FormItem className="flex items-center space-x-2">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    className="border-[#8B4513] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel className="text-[#4A2512] font-medium cursor-pointer">Bebida Alcoólica (18+)</FormLabel>
                                                <FormDescription className="text-[#8B4513]/80 text-xs">
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
                            </div>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-[#8B4513] hover:bg-[#4A2512] text-white font-semibold shadow-md transition-colors mt-6"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Atualizando bebida..." : "Atualizar Bebida"}
                </Button>
            </form>
        </Form>
    )
} 