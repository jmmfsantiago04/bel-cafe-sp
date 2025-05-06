'use server'

import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { capacity } from "@/db/schema"

export async function getCapacity(date: string) {
    try {
        const result = await db.select().from(capacity).where(eq(capacity.date, date));
        return result[0] || { date, cafe: 30, almoco: 30, jantar: 30 };
    } catch (error) {
        return { error: 'Erro ao buscar capacidade' };
    }
}

export async function updateCapacity(data: { date: string, cafe: number, almoco: number, jantar: number }) {
    try {
        const result = await db
            .insert(capacity)
            .values(data)
            .onConflictDoUpdate({
                target: capacity.date,
                set: { ...data, updatedAt: new Date() }
            })
            .returning();
        return { success: true, data: result[0] };
    } catch (error) {
        return { error: 'Erro ao atualizar capacidade' };
    }
} 