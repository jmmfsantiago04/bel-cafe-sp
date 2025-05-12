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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const formSchema = z.object({
    selectionType: z.enum(["items", "category"]),
    itemIds: z.array(z.string()),
    itemType: z.enum(["menu", "drink"], {
        required_error: "Selecione o tipo do item",
    }),
    category: z.enum([
        "cafe-manha",
        "almoco",
        "jantar",
        "salgados",
        "doces",
        "sobremesas",
        "bebidas-quentes",
        "bebidas-frias"
    ]).optional(),
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
}).refine((data) => {
    // Ou tem itemIds selecionados ou tem categoria selecionada
    return (data.selectionType === "items" && data.itemIds.length > 0) ||
        (data.selectionType === "category" && data.category);
}, {
    message: "Selecione itens específicos ou uma categoria",
});

type FormData = z.infer<typeof formSchema>;

const categoryOptions = [
    { value: "cafe-manha", label: "Café da Manhã" },
    { value: "almoco", label: "Almoço" },
    { value: "jantar", label: "Jantar" },
    { value: "salgados", label: "Salgados" },
    { value: "doces", label: "Doces" },
    { value: "sobremesas", label: "Sobremesas" },
    { value: "bebidas-quentes", label: "Bebidas Quentes" },
    { value: "bebidas-frias", label: "Bebidas Frias" },
];

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
            selectionType: "items",
            itemType: "menu",
            itemIds: [],
            discount: 0,
        },
    });

    const itemType = form.watch("itemType");
    const selectedIds = form.watch("itemIds");
    const selectionType = form.watch("selectionType");

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
        form.setValue("itemIds", []); // Limpar seleção quando mudar o tipo
    }, [itemType, form]);

    const onSubmit = async (data: FormData) => {
        try {
            setIsLoading(true);
            let hasError = false;
            let itemsToUpdate: string[] = [];

            // Se for por categoria, pegar todos os itens da categoria
            if (data.selectionType === "category" && data.category) {
                if (data.category === "bebidas-quentes" || data.category === "bebidas-frias") {
                    const isHot = data.category === "bebidas-quentes";
                    itemsToUpdate = drinks
                        .filter(drink => drink.isHotDrink === isHot)
                        .map(drink => drink.id.toString());
                } else {
                    const categoryField = {
                        "cafe-manha": "isCafeDaManha",
                        "almoco": "isAlmoco",
                        "jantar": "isJantar",
                        "salgados": "isSalgado",
                        "doces": "isDoce",
                        "sobremesas": "isSobremesa",
                    }[data.category];

                    itemsToUpdate = menuItems
                        .filter(item => item[categoryField])
                        .map(item => item.id.toString());
                }
            } else {
                itemsToUpdate = data.itemIds;
            }

            // Aplicar desconto para cada item
            for (const itemId of itemsToUpdate) {
                const result = await applyDiscount({
                    itemId,
                    itemType: data.selectionType === "category" &&
                        (data.category === "bebidas-quentes" || data.category === "bebidas-frias")
                        ? "drink" : "menu",
                    discount: data.discount,
                    startDate: data.startDate,
                    endDate: data.endDate,
                });

                if ('error' in result) {
                    toast.error(`Erro ao aplicar desconto para o item ${itemId}: ${result.error}`);
                    hasError = true;
                }
            }

            if (!hasError) {
                const message = data.selectionType === "category"
                    ? `Desconto aplicado com sucesso para a categoria ${categoryOptions.find(c => c.value === data.category)?.label}!`
                    : `Desconto aplicado com sucesso para ${itemsToUpdate.length} ${itemsToUpdate.length === 1 ? 'item' : 'itens'}!`;

                toast.success(message);
                form.reset();
                router.refresh();
                onSuccess?.();
            }
        } catch (error) {
            console.error("Error applying discounts:", error);
            toast.error(error instanceof Error ? error.message : "Erro ao aplicar descontos");
        } finally {
            setIsLoading(false);
        }
    };

    const currentItems = itemType === "menu" ? menuItems : drinks;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="items" className="w-full" onValueChange={(value) => form.setValue("selectionType", value as "items" | "category")}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="items">Itens Específicos</TabsTrigger>
                        <TabsTrigger value="category">Por Categoria</TabsTrigger>
                    </TabsList>

                    <TabsContent value="items" className="space-y-4">
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
                            name="itemIds"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Itens</FormLabel>
                                    <FormControl>
                                        <ScrollArea className="h-[200px] border rounded-md p-4">
                                            <div className="space-y-2">
                                                {currentItems.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            checked={selectedIds.includes(item.id.toString())}
                                                            onCheckedChange={(checked) => {
                                                                const currentIds = new Set(selectedIds);
                                                                if (checked) {
                                                                    currentIds.add(item.id.toString());
                                                                } else {
                                                                    currentIds.delete(item.id.toString());
                                                                }
                                                                form.setValue("itemIds", Array.from(currentIds));
                                                            }}
                                                        />
                                                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                            {item.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </ScrollArea>
                                    </FormControl>
                                    <FormDescription>
                                        Selecione um ou mais itens para aplicar o desconto
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>

                    <TabsContent value="category" className="space-y-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categoryOptions.map((category) => (
                                                <SelectItem key={category.value} value={category.value}>
                                                    {category.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        O desconto será aplicado a todos os itens da categoria selecionada
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </TabsContent>
                </Tabs>

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