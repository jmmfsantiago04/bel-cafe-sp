'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DatePicker } from "@/components/ui/date-picker"
import { applyDiscount } from "@/app/actions/discounts"
import { getMenuItems } from "@/app/actions/menu"
import { getAllDrinks } from "@/app/actions/drinks"

const formSchema = z.object({
    itemId: z.string().min(1, "Selecione um item"),
    itemType: z.enum(["menu", "drink"], {
        required_error: "Selecione o tipo do item",
    }),
    discount: z.coerce.number()
        .min(1, "Desconto deve ser no mínimo 1%")
        .max(100, "Desconto deve ser no máximo 100%"),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
}).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate > data.startDate;
    }
    return true;
}, {
    message: "A data final deve ser posterior à data inicial",
    path: ["endDate"],
});

type FormData = z.infer<typeof formSchema>;

export function DiscountForm({
    onSuccess,
}: {
    onSuccess?: () => void
}) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [drinks, setDrinks] = useState<any[]>([]);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemType: "menu",
            discount: 0,
        },
    });

    const itemType = form.watch("itemType");

    // Carregar itens baseado no tipo selecionado
    const loadItems = async (type: "menu" | "drink") => {
        try {
            if (type === "menu") {
                const result = await getMenuItems();
                if ('data' in result) {
                    setMenuItems(result.data || []);
                } else {
                    throw new Error(result.error);
                }
            } else {
                const result = await getAllDrinks();
                if (!('error' in result) && Array.isArray(result)) {
                    setDrinks(result || []);
                } else {
                    throw new Error('error' in result ? result.error : "Falha ao carregar bebidas");
                }
            }
        } catch (error) {
            console.error("Error loading items:", error);
            toast.error("Erro ao carregar itens");
        }
    };

    // Carregar itens quando o tipo mudar
    useEffect(() => {
        loadItems(itemType);
    }, [itemType]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            const result = await applyDiscount(data);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Desconto aplicado com sucesso!");
            form.reset();
            router.refresh();
            onSuccess?.();
        } catch (error) {
            console.error("Error applying discount:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao aplicar desconto");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="itemType"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tipo de Item</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o tipo de item" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="menu">Item do Cardápio</SelectItem>
                                    <SelectItem value="drink">Bebida</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="itemId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione um item" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {itemType === "menu" ? (
                                        menuItems.map((item) => (
                                            <SelectItem key={item.id} value={item.id.toString()}>
                                                {item.name}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        drinks.map((drink) => (
                                            <SelectItem key={drink.id} value={drink.id.toString()}>
                                                {drink.name}
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Desconto (%)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    min={1}
                                    max={100}
                                    placeholder="Digite o valor do desconto"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Digite um valor entre 1 e 100
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Inicial</FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Opcional - Data de início do desconto
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Data Final</FormLabel>
                            <FormControl>
                                <DatePicker
                                    date={field.value}
                                    setDate={field.onChange}
                                />
                            </FormControl>
                            <FormDescription>
                                Opcional - Data de término do desconto
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Aplicando..." : "Aplicar Desconto"}
                </Button>
            </form>
        </Form>
    );
} 