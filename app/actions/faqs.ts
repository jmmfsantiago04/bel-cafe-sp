'use server'

import { db } from "@/lib/db"
import { faqs } from "@/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { type FaqFormData } from "@/app/types/faqs"

export async function createFaq(data: FaqFormData) {
    try {
        const result = await db.insert(faqs).values({
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()

        revalidatePath('/admin/duvidas')
        revalidatePath('/duvidas')

        return { data: result[0] }
    } catch (error) {
        console.error('Error creating FAQ:', error)
        return { error: 'Erro ao criar FAQ' }
    }
}

export async function updateFaq(id: number, data: FaqFormData) {
    try {
        const result = await db.update(faqs)
            .set({
                ...data,
                updatedAt: new Date(),
            })
            .where(eq(faqs.id, id))
            .returning()

        revalidatePath('/admin/duvidas')
        revalidatePath('/duvidas')

        return { data: result[0] }
    } catch (error) {
        console.error('Error updating FAQ:', error)
        return { error: 'Erro ao atualizar FAQ' }
    }
}

export async function deleteFaq(id: number) {
    try {
        await db.delete(faqs)
            .where(eq(faqs.id, id))

        revalidatePath('/admin/duvidas')
        revalidatePath('/duvidas')

        return { success: true }
    } catch (error) {
        console.error('Error deleting FAQ:', error)
        return { error: 'Erro ao deletar FAQ' }
    }
}

export async function getFaq(id: number) {
    try {
        const result = await db.query.faqs.findFirst({
            where: eq(faqs.id, id)
        })

        return { data: result }
    } catch (error) {
        console.error('Error getting FAQ:', error)
        return { error: 'Erro ao buscar FAQ' }
    }
}

export async function getAllFaqs() {
    try {
        const result = await db
            .select()
            .from(faqs)
            .orderBy(faqs.displayOrder)

        return { data: result }
    } catch (error) {
        console.error('Error getting all FAQs:', error)
        return { error: 'Erro ao buscar FAQs' }
    }
}

export async function getActiveFaqs() {
    try {
        const result = await db
            .select()
            .from(faqs)
            .where(eq(faqs.isActive, true))
            .orderBy(faqs.displayOrder)

        return { data: result }
    } catch (error) {
        console.error('Error getting active FAQs:', error)
        return { error: 'Erro ao buscar FAQs ativas' }
    }
} 