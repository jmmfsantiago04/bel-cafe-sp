'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { BusinessHoursFormData, deleteBusinessHours, updateBusinessHours } from "@/app/actions/business-hours"
import { zodResolver } from "@hookform/resolvers/zod"
import { Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

const formSchema = z.object({
    id: z.number().optional(),
    period: z.enum(["cafe", "almoco", "jantar"]),
    weekdays: z.string().min(1, "Informe os dias da semana"),
    openTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido. Use HH:MM"),
    closeTime: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato inválido. Use HH:MM"),
    isActive: z.boolean(),
})

type BusinessHoursFormProps = {
    initialData?: BusinessHoursFormData
}

export function BusinessHoursForm({ initialData }: BusinessHoursFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            period: "cafe",
            weekdays: "Segunda a Domingo",
            openTime: "07:00",
            closeTime: "11:00",
            isActive: true,
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const result = await updateBusinessHours(values)

        if (result.error) {
            toast.error("Erro ao salvar horário", {
                description: result.error,
            })
            return
        }

        toast.success("Horário salvo com sucesso!", {
            description: "Os horários foram atualizados.",
        })
    }

    async function onDelete() {
        if (!initialData?.id) return

        const result = await deleteBusinessHours(initialData.id)

        if (result.error) {
            toast.error("Erro ao excluir horário", {
                description: result.error,
            })
            return
        }

        toast.success("Horário excluído com sucesso!", {
            description: "O horário foi removido.",
        })
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-[#4A2512]">
                    {initialData ? "Editar Horário" : "Novo Horário"}
                </CardTitle>
                <CardDescription>
                    {initialData ? "Atualize os horários de funcionamento" : "Adicione um novo horário de funcionamento"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="period"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Período</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione o período" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="cafe">Café da Manhã</SelectItem>
                                            <SelectItem value="almoco">Almoço</SelectItem>
                                            <SelectItem value="jantar">Jantar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="weekdays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Dias da Semana</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Ex: Segunda a Domingo" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="openTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horário de Abertura</FormLabel>
                                        <FormControl>
                                            <Input placeholder="07:00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="closeTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Horário de Fechamento</FormLabel>
                                        <FormControl>
                                            <Input placeholder="11:00" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Ativo</FormLabel>
                                        <CardDescription>
                                            Determina se este horário está ativo
                                        </CardDescription>
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

                        <div className="flex justify-between">
                            <Button type="submit" className="bg-[#8B4513] hover:bg-[#4A2512]">
                                Salvar
                            </Button>
                            {initialData?.id && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={onDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                </Button>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 