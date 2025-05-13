'use server'

import { db } from "@/lib/db"
import { capacity } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function updateCapacity(data: { date: string, cafe: number, almoco: number, jantar: number }) {
    try {
        const existingCapacity = await db.query.capacity.findFirst({
            where: eq(capacity.date, data.date)
        });

        if (existingCapacity) {
            await db.update(capacity)
                .set({
                    cafe: data.cafe,
                    almoco: data.almoco,
                    jantar: data.jantar,
                    updatedAt: new Date()
                })
                .where(eq(capacity.date, data.date));
        } else {
            await db.insert(capacity).values({
                date: data.date,
                cafe: data.cafe,
                almoco: data.almoco,
                jantar: data.jantar,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating capacity:', error);
        return { error: 'Failed to update capacity' };
    }
} 