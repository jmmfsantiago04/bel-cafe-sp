'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createBlogPost } from "@/app/actions/blog"
import { BlogPostFormData, blogPostFormSchema } from "@/app/actions/blog/types"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

type FormData = z.infer<typeof blogPostFormSchema>

const CATEGORIES = [
    { value: "curiosidades", label: "Curiosidades" },
    { value: "receitas", label: "Receitas" },
    { value: "historia", label: "História" },
] as const

export function AddBlogPostForm({
    onSuccess,
}: {
    onSuccess?: () => void
}) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(blogPostFormSchema),
        defaultValues: {
            title: "",
            content: "",
            imageUrl: null,
            category: "curiosidades",
            author: "",
            isPublished: false,
        },
    })

    async function onSubmit(values: FormData) {
        try {
            setIsSubmitting(true)
            const result = await createBlogPost(values)

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Post criado com sucesso!", {
                description: "O post foi adicionado ao blog.",
            })

            form.reset()
            onSuccess?.()
            router.refresh()
        } catch (error) {
            toast.error("Erro ao criar post", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Digite o título do post"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Conteúdo</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Digite o conteúdo do post..."
                                        className="min-h-[200px] resize-none"
                                        {...field}
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
                                <FormLabel>URL da Imagem</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="https://..."
                                        {...field}
                                        value={field.value || ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Selecione uma categoria" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {CATEGORIES.map((category) => (
                                                <SelectItem
                                                    key={category.value}
                                                    value={category.value}
                                                >
                                                    {category.label}
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
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Autor</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Nome do autor"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Publicar Imediatamente
                                    </FormLabel>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Criando post..." : "Criar Post"}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 