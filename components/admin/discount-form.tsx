'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { applyDiscount } from "@/app/actions/discounts"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    itemType: z.enum(["menu", "drink"]),
    itemId: z.string().min(1, "Selecione um item"),
    discount: z.coerce.number().min(1).max(100),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
})

type FormData = z.infer<typeof formSchema>;

interface DiscountFormProps {
    onSuccess?: () => void;
    menuItems: any[];
    drinks: any[];
}

export function DiscountForm({
    onSuccess,
    menuItems,
    drinks,
}: DiscountFormProps) {
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemType: "menu",
            itemId: "",
            discount: 0,
        },
    })

    const itemType = form.watch("itemType")
    const items = itemType === "menu" ? menuItems : drinks

    async function onSubmit(data: FormData) {
        try {
            const result = await applyDiscount(data)

            if (result.error) {
                toast.error("Erro ao aplicar desconto", {
                    description: result.error,
                })
                return
            }

            toast.success("Desconto aplicado com sucesso!", {
                description: "O desconto foi aplicado ao item selecionado.",
            })

            form.reset()
            router.refresh()
            onSuccess?.()
        } catch (error) {
            console.error("Error applying discount:", error)
            toast.error("Erro ao aplicar desconto", {
                description: "Ocorreu um erro ao tentar aplicar o desconto.",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[#4A2512]">Aplicar Desconto</CardTitle>
                <CardDescription>
                    Selecione um item e defina o percentual de desconto
                </CardDescription>
            </CardHeader>
            <CardContent>
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
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="menu">Menu</SelectItem>
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
                                            {items.map((item) => (
                                                <SelectItem
                                                    key={item.id}
                                                    value={item.id.toString()}
                                                >
                                                    {item.name}
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
                            name="discount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Desconto (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={100}
                                            placeholder="10"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="bg-[#8B4513] hover:bg-[#4A2512]">
                            Aplicar Desconto
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 