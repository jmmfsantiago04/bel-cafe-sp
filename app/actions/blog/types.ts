import { z } from "zod"

export const blogPostFormSchema = z.object({
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    content: z.string().min(10, {
        message: "O conteúdo deve ter pelo menos 10 caracteres.",
    }),
    imageUrl: z.string().url({
        message: "Digite uma URL válida para a imagem.",
    }).nullable(),
    category: z.enum(["curiosidades", "receitas", "historia"], {
        required_error: "Selecione uma categoria.",
    }),
    author: z.string().min(2, {
        message: "O nome do autor deve ter pelo menos 2 caracteres.",
    }),
    isPublished: z.boolean(),
})

export type BlogPostFormData = z.infer<typeof blogPostFormSchema>

// Helper function for generating URL-friendly slugs
export function slugify(text: string): string {
    return text
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

// Type for blog post responses from the server
export type BlogPostResponse = {
    id: number
    title: string
    content: string
    imageUrl: string | null
    category: "curiosidades" | "receitas" | "historia"
    slug: string
    author: string
    isPublished: boolean
    publishedAt: Date | null
    createdAt: Date
    updatedAt: Date
} 