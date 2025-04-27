'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { createCategory, updateCategory, type CategoryFormData } from "@/app/actions/categories"
import { toast } from "sonner"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(50, "Nome deve ter no máximo 50 caracteres"),
    description: z.string().nullable(),
    isActive: z.boolean(),
}) satisfies z.ZodType<CategoryFormData>

type FormData = z.infer<typeof formSchema>;

export function CategoriesForm({
    initialData,
    categoryId,
    onSuccess
}: {
    initialData?: CategoryFormData
    categoryId?: number
    onSuccess?: () => void
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: initialData?.name ?? "",
            description: initialData?.description ?? null,
            isActive: initialData?.isActive ?? true,
        },
    })

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true)
            setError(null)

            if (categoryId) {
                const result = await updateCategory(categoryId, data)
                if (result.error) {
                    throw new Error(result.error)
                }
            } else {
                const result = await createCategory(data)
                if (result.error) {
                    throw new Error(result.error)
                }
            }

            toast.success("Sucesso", {
                description: categoryId ? "Categoria atualizada com sucesso" : "Categoria criada com sucesso",
            })
            router.refresh()
            onSuccess?.()
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            } else {
                setError("Ocorreu um erro ao salvar a categoria")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-[#8B4513] font-serif">
                    {initialData ? "Editar Categoria" : "Nova Categoria"}
                </h2>
                <p className="text-[#D2691E] text-sm italic">
                    {initialData ? "Atualize os dados da categoria" : "Adicione uma nova categoria ao cardápio"}
                </p>
            </div>

            <div className="bg-[#FDF5E6] rounded-lg p-6 border border-[#DEB887]">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
                        {error}
                    </div>
                )}

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#8B4513] font-semibold">Nome da Categoria</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Cafés, Bolos, Tapiocas..."
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
                                            placeholder="Descreva a categoria..."
                                            className="border-[#DEB887] focus:border-[#8B4513] min-h-[100px]"
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
                            name="isActive"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border border-[#DEB887] p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-[#8B4513] font-semibold">Categoria Ativa</FormLabel>
                                        <FormDescription>
                                            Ative ou desative a exibição desta categoria no cardápio
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

                        <Button
                            type="submit"
                            className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold py-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Processando...
                                </div>
                            ) : (
                                initialData ? "Salvar Alterações" : "Criar Categoria"
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 