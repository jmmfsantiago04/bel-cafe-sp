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

export function DrinkForm() {
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
            router.push("/admin/menu");
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
        <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-[#8B4513] font-serif">
                    Nova Bebida
                </h2>
                <p className="text-[#D2691E] text-sm italic">
                    Adicione uma nova bebida ao cardápio
                </p>
            </div>

            <div className="bg-[#FDF5E6] rounded-lg p-6 border-2 border-[#DEB887] shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] font-semibold">Nome da Bebida</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Café Expresso"
                                                className="border-[#DEB887] focus:border-[#8B4513]"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] font-semibold">Descrição</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Descreva a bebida..."
                                                className="border-[#DEB887] focus:border-[#8B4513]"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] font-semibold">Preço Base (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0,00"
                                                className="border-[#DEB887] focus:border-[#8B4513]"
                                                {...field}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] font-semibold">URL da Imagem</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="https://..."
                                                className="border-[#DEB887] focus:border-[#8B4513]"
                                                {...field}
                                                value={field.value ?? ""}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="space-y-2">
                                <FormLabel className="text-[#8B4513] font-semibold">Tipo de Bebida</FormLabel>
                                <div className="flex gap-8 items-center">
                                    <FormField
                                        control={form.control}
                                        name="isHotDrink"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(checked);
                                                            if (checked) {
                                                                form.setValue("isHotDrink", true);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Bebida Quente
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="isHotDrink"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={!field.value}
                                                        onCheckedChange={(checked) => {
                                                            field.onChange(!checked);
                                                            if (checked) {
                                                                form.setValue("isHotDrink", false);
                                                            }
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Bebida Gelada
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="hasSize"
                                render={({ field }) => (
                                    <FormItem className="flex items-center space-x-2">
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                            <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                Possui diferentes tamanhos
                                            </FormLabel>
                                            <FormDescription>
                                                Marque se esta bebida possui opções de tamanho
                                            </FormDescription>
                                        </div>
                                    </FormItem>
                                )}
                            />

                            {hasSize && (
                                <>
                                    <FormField
                                        control={form.control}
                                        name="mediumSizePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#8B4513] font-semibold">Preço Tamanho Médio</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0,00"
                                                        className="border-[#DEB887] focus:border-[#8B4513]"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="largeSizePrice"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#8B4513] font-semibold">Preço Tamanho Grande</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="0,00"
                                                        className="border-[#DEB887] focus:border-[#8B4513]"
                                                        {...field}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value ? Number(e.target.value) : null
                                                            )
                                                        }
                                                        value={field.value ?? ""}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            <div className="space-y-4">
                                <FormLabel className="text-[#8B4513] font-semibold block">Restrições Alimentares</FormLabel>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="isGlutenFree"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Sem Glúten
                                                </FormLabel>
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
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Vegetariano
                                                </FormLabel>
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
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Vegano
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <FormLabel className="text-[#8B4513] font-semibold block">Status</FormLabel>
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="isAlcoholic"
                                        render={({ field }) => (
                                            <FormItem className="flex items-center space-x-2">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={field.onChange}
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                        Bebida Alcoólica (18+)
                                                    </FormLabel>
                                                    <FormDescription>
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
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Disponível no Cardápio
                                                </FormLabel>
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
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-[#8B4513] font-medium cursor-pointer">
                                                    Marcar como Popular
                                                </FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold py-3"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processando...
                                </div>
                            ) : (
                                "Adicionar ao Cardápio"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 