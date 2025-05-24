'use server'

import { db } from "@/lib/db"
import { aboutContent } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { type AboutContentFormData } from "@/app/types/about"

export async function createAboutContent(data: AboutContentFormData) {
    try {
        const result = await db.insert(aboutContent).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()

        revalidatePath('/admin/sobre-nos')
        revalidatePath('/sobre-nos')

        return { data: result[0] }
    } catch (error) {
        console.error('Error creating about content:', error)
        return { error: 'Erro ao criar conteúdo' }
    }
}

export async function updateAboutContent(id: number, data: AboutContentFormData) {
    try {
        const result = await db.update(aboutContent)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(aboutContent.id, id))
            .returning()

        revalidatePath('/admin/sobre-nos')
        revalidatePath('/sobre-nos')

        return { data: result[0] }
    } catch (error) {
        console.error('Error updating about content:', error)
        return { error: 'Erro ao atualizar conteúdo' }
    }
}

export async function deleteAboutContent(id: number) {
    try {
        await db.delete(aboutContent)
            .where(eq(aboutContent.id, id))

        revalidatePath('/admin/sobre-nos')
        revalidatePath('/sobre-nos')

        return { success: true }
    } catch (error) {
        console.error('Error deleting about content:', error)
        return { error: 'Erro ao deletar conteúdo' }
    }
}

export async function getAboutContent(id: number) {
    try {
        const result = await db.query.aboutContent.findFirst({
            where: eq(aboutContent.id, id)
        })

        return { data: result }
    } catch (error) {
        console.error('Error getting about content:', error)
        return { error: 'Erro ao buscar conteúdo' }
    }
}

export async function getAllAboutContent() {
    try {
        const result = await db
            .select()
            .from(aboutContent)
            .orderBy(aboutContent.section, aboutContent.displayOrder)

        return { data: result }
    } catch (error) {
        console.error('Error getting all about content:', error)
        return { error: 'Erro ao buscar conteúdo' }
    }
}

export async function getActiveAboutContent() {
    try {
        const result = await db
            .select()
            .from(aboutContent)
            .where(eq(aboutContent.isActive, true))
            .orderBy(aboutContent.section, aboutContent.displayOrder)

        return { data: result }
    } catch (error) {
        console.error('Error getting active about content:', error)
        return { error: 'Erro ao buscar conteúdo ativo' }
    }
} 