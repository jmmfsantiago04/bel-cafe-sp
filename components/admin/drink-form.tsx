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
                    disabled={isLoading}
                >
                    {isLoading ? "Adicionando bebida..." : "Adicionar Bebida"}
                </Button>
            </form>
        </Form>
    )
} 