'use server'

import { z } from "zod"
import { db } from "@/lib/db"
import { blogPosts } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { revalidatePath } from "next/cache"

// Schema and Types
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

// Helper function for generating URL-friendly slugs
function slugify(text: string): string {
    return text
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

// Server Actions
export async function createBlogPost(data: BlogPostFormData) {
    try {
        const slug = slugify(data.title)
        const now = new Date()

        const result = await db.insert(blogPosts).values({
            ...data,
            slug,
            publishedAt: data.isPublished ? now : null,
            createdAt: now,
            updatedAt: now,
        }).returning()

        revalidatePath('/blog')
        revalidatePath('/admin/blog')

        return { data: result[0] }
    } catch (error) {
        console.error('Error creating blog post:', error)
        return { error: 'Erro ao criar post' }
    }
}

export async function updateBlogPost(id: number, data: BlogPostFormData) {
    try {
        const now = new Date()
        const result = await db.update(blogPosts)
            .set({
                ...data,
                updatedAt: now,
                publishedAt: data.isPublished ? now : null,
            })
            .where(eq(blogPosts.id, id))
            .returning()

        revalidatePath('/blog')
        revalidatePath('/admin/blog')

        return { data: result[0] }
    } catch (error) {
        console.error('Error updating blog post:', error)
        return { error: 'Erro ao atualizar post' }
    }
}

export async function deleteBlogPost(id: number) {
    try {
        await db.delete(blogPosts)
            .where(eq(blogPosts.id, id))

        revalidatePath('/blog')
        revalidatePath('/admin/blog')

        return { success: true }
    } catch (error) {
        console.error('Error deleting blog post:', error)
        return { error: 'Erro ao deletar post' }
    }
}

export async function getBlogPost(id: number) {
    try {
        const result = await db.query.blogPosts.findFirst({
            where: eq(blogPosts.id, id)
        })

        return { data: result }
    } catch (error) {
        console.error('Error getting blog post:', error)
        return { error: 'Erro ao buscar post' }
    }
}

export async function getAllBlogPosts() {
    try {
        const result = await db
            .select()
            .from(blogPosts)
            .orderBy(desc(blogPosts.createdAt))

        return { data: result }
    } catch (error) {
        console.error('Error getting all blog posts:', error)
        return { error: 'Erro ao buscar posts' }
    }
}

export async function getPublishedBlogPosts() {
    try {
        const result = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.isPublished, true))
            .orderBy(desc(blogPosts.publishedAt))

        return { data: result }
    } catch (error) {
        console.error('Error getting published blog posts:', error)
        return { error: 'Erro ao buscar posts publicados' }
    }
}

export async function getBlogPostBySlug(slug: string) {
    try {
        const result = await db
            .select()
            .from(blogPosts)
            .where(eq(blogPosts.slug, slug))
            .limit(1)

        return { data: result[0] }
    } catch (error) {
        console.error('Error getting blog post by slug:', error)
        return { error: 'Erro ao buscar post' }
    }
} 