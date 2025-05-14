'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { updateStoreStatus, getStoreStatus } from "@/app/actions/store-status"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect } from "react"

const formSchema = z.object({
    isOpen: z.boolean(),
    reason: z.string().optional(),
    reopenDate: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

export function StoreStatusForm() {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isOpen: true,
            reason: "",
            reopenDate: "",
        },
    })

    useEffect(() => {
        const loadCurrentStatus = async () => {
            const status = await getStoreStatus()
            if (!('error' in status)) {
                form.reset({
                    isOpen: status.isOpen,
                    reason: status.reason || "",
                    reopenDate: status.reopenDate || "",
                })
            }
        }
        loadCurrentStatus()
    }, [form])

    async function onSubmit(data: FormData) {
        try {
            const result = await updateStoreStatus(data)
            if ('error' in result) {
                throw new Error(result.error)
            }
            toast.success("Status da loja atualizado com sucesso!")
        } catch (error) {
            toast.error("Erro ao atualizar status da loja", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                    <Store className="h-6 w-6 text-[#8B4513]" />
                    <div>
                        <CardTitle>Status da Loja</CardTitle>
                        <CardDescription>
                            Gerencie o status de funcionamento da loja
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="isOpen"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel>Loja Aberta</FormLabel>
                                        <CardDescription>
                                            Determina se a loja está aberta ou fechada
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

                        {!form.watch("isOpen") && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Motivo do Fechamento</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Ex: Manutenção programada" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="reopenDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Data de Reabertura</FormLabel>
                                            <FormControl>
                                                <Input type="datetime-local" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </>
                        )}

                        <Button type="submit" className="bg-[#8B4513] hover:bg-[#4A2512]">
                            Salvar Alterações
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
} 