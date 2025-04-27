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
import { Switch } from "@/components/ui/switch"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createMenuItem, type MenuItemFormData } from "@/app/actions/menu"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    description: z.string().nullable(),
    categoryId: z.coerce.number({
        required_error: "Selecione uma categoria",
        invalid_type_error: "Selecione uma categoria válida",
    }),
    price: z.coerce.number().min(0, "Preço deve ser maior ou igual a 0"),
    imageUrl: z.string().nullable(),
    isAvailable: z.boolean(),
    isPopular: z.boolean(),
    hasSize: z.boolean(),
    mediumSizePrice: z.coerce.number().nullable(),
    largeSizePrice: z.coerce.number().nullable(),
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

interface MenuItemFormProps {
    categories: {
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
    }[];
}

export function MenuItemForm({ categories }: MenuItemFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: null,
            categoryId: undefined,
            price: 0,
            imageUrl: null,
            isAvailable: true,
            isPopular: false,
            hasSize: false,
            mediumSizePrice: null,
            largeSizePrice: null,
        },
    });

    const hasSize = form.watch("hasSize");

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true);
            const result = await createMenuItem(data as MenuItemFormData);

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Sucesso", {
                description: "Item adicionado ao cardápio",
            });
            router.push("/admin/menu");
            router.refresh();
        } catch (error) {
            toast.error("Erro", {
                description: error instanceof Error ? error.message : "Algo deu errado ao criar o item",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-[#8B4513] font-serif">
                    Novo Item do Cardápio
                </h2>
                <p className="text-[#D2691E] text-sm italic">
                    Adicione os sabores do Nordeste ao nosso cardápio
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
                                        <FormLabel className="text-[#8B4513] font-semibold">Nome do Item</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Café de Corda"
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
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] font-semibold">Categoria</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value?.toString()}>
                                            <FormControl>
                                                <SelectTrigger className="border-[#DEB887] focus:border-[#8B4513]">
                                                    <SelectValue placeholder="Selecione uma categoria" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                        disabled={!category.isActive}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                                                placeholder="Descreva o item..."
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

                            <FormField
                                control={form.control}
                                name="hasSize"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#DEB887] p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-[#8B4513] font-semibold">Opções de Tamanho</FormLabel>
                                            <FormDescription>
                                                Ative se este item possui diferentes tamanhos
                                            </FormDescription>
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

                            <div className="flex space-x-4">
                                <FormField
                                    control={form.control}
                                    name="isAvailable"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#DEB887] p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-[#8B4513] font-semibold">Disponível</FormLabel>
                                                <FormDescription>
                                                    Mostrar este item no cardápio
                                                </FormDescription>
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

                                <FormField
                                    control={form.control}
                                    name="isPopular"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#DEB887] p-4">
                                            <div className="space-y-0.5">
                                                <FormLabel className="text-[#8B4513] font-semibold">Item Popular</FormLabel>
                                                <FormDescription>
                                                    Marcar como item popular
                                                </FormDescription>
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