'use server'

import { requireAdmin } from "@/lib/require-admin"

import { db } from "@/lib/db"
import { blogPosts } from "@/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { type BlogPostFormData } from "@/app/actions/blog-types"

function slugify(text: string): string {
    return text
        .normalize('NFKD')
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
}

export async function createBlogPost(data: BlogPostFormData) {
    await requireAdmin()
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
    await requireAdmin()
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
    await requireAdmin()
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
    await requireAdmin()
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
    await requireAdmin()
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
            .where(
                and(
                    eq(blogPosts.slug, slug),
                    eq(blogPosts.isPublished, true),
                ),
            )
            .limit(1)

        return { data: result[0] }
    } catch (error) {
        console.error('Error getting blog post by slug:', error)
        return { error: 'Erro ao buscar post' }
    }
}
