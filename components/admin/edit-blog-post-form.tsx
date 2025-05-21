'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { updateBlogPost } from "@/app/actions/blog"
import { BlogPostFormData, blogPostFormSchema, BlogPostResponse } from "@/app/actions/blog/types"
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

const CATEGORIES = [
    { value: "curiosidades", label: "Curiosidades" },
    { value: "receitas", label: "Receitas" },
    { value: "historia", label: "História" },
] as const

interface EditBlogPostFormProps {
    post: BlogPostResponse
    onSuccess?: () => void
}

export function EditBlogPostForm({ post, onSuccess }: EditBlogPostFormProps) {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const form = useForm<BlogPostFormData>({
        resolver: zodResolver(blogPostFormSchema),
        defaultValues: {
            title: post.title,
            content: post.content,
            imageUrl: post.imageUrl,
            category: post.category,
            author: post.author,
            isPublished: post.isPublished,
        },
    })

    async function onSubmit(values: BlogPostFormData) {
        try {
            setIsSubmitting(true)
            const result = await updateBlogPost(post.id, values)

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Post atualizado com sucesso!", {
                description: "As alterações foram salvas.",
            })

            onSuccess?.()
            router.refresh()
        } catch (error) {
            toast.error("Erro ao atualizar post", {
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
                        {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </Form>
    )
} 