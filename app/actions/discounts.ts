'use server'

import { db } from "@/lib/db"
import { menuItems, drinks } from "@/db/schema"
import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export type DiscountFormData = {
    itemId: string
    itemType: "menu" | "drink"
    discount: number
    startDate?: Date
    endDate?: Date
}

function calculateDiscountedPrice(originalPrice: string | null, discountPercentage: number): string | null {
    if (!originalPrice) return null;
    const price = parseFloat(originalPrice);
    const discountAmount = (price * discountPercentage) / 100;
    return (price - discountAmount).toFixed(2);
}

export async function applyDiscountByCategory(category: string, discount: number, startDate?: Date, endDate?: Date) {
    try {
        // Validar desconto
        if (discount < 0 || discount > 100) {
            throw new Error("Desconto deve estar entre 0 e 100%");
        }

        // Validar datas
        if (startDate && endDate && startDate > endDate) {
            throw new Error("Data inicial deve ser anterior à data final");
        }

        if (category === "bebidas-quentes" || category === "bebidas-frias") {
            const isHot = category === "bebidas-quentes";
            const items = await db
                .select()
                .from(drinks)
                .where(eq(drinks.isHotDrink, isHot));

            // Atualizar todos os itens da categoria
            for (const item of items) {
                const finalPrice = calculateDiscountedPrice(item.price, discount);
                const mediumFinalPrice = calculateDiscountedPrice(item.mediumSizePrice, discount);
                const largeFinalPrice = calculateDiscountedPrice(item.largeSizePrice, discount);

                await db.update(drinks)
                    .set({
                        discount: discount.toString(),
                        discountStartDate: startDate?.toISOString() || null,
                        discountEndDate: endDate?.toISOString() || null,
                        isDiscounted: true,
                        finalPrice,
                        mediumFinalPrice,
                        largeFinalPrice,
                    })
                    .where(eq(drinks.id, item.id));
            }
        } else {
            const categoryField = {
                "cafe-manha": menuItems.isCafeDaManha,
                "almoco": menuItems.isAlmoco,
                "jantar": menuItems.isJantar,
                "salgados": menuItems.isSalgado,
                "doces": menuItems.isDoce,
                "sobremesas": menuItems.isSobremesa,
            }[category];

            if (!categoryField) {
                throw new Error("Categoria inválida");
            }

            const items = await db
                .select()
                .from(menuItems)
                .where(eq(categoryField, true));

            // Atualizar todos os itens da categoria
            for (const item of items) {
                const finalPrice = calculateDiscountedPrice(item.price, discount);
                const mediumFinalPrice = calculateDiscountedPrice(item.mediumSizePrice, discount);
                const largeFinalPrice = calculateDiscountedPrice(item.largeSizePrice, discount);

                await db.update(menuItems)
                    .set({
                        discount: discount.toString(),
                        discountStartDate: startDate?.toISOString() || null,
                        discountEndDate: endDate?.toISOString() || null,
                        isDiscounted: true,
                        finalPrice,
                        mediumFinalPrice,
                        largeFinalPrice,
                    })
                    .where(eq(menuItems.id, item.id));
            }
        }

        revalidatePath('/menu');
        revalidatePath('/admin/menu');
        revalidatePath('/admin/discounts');

        return { success: true };
    } catch (error) {
        console.error("Error applying category discount:", error);
        return { error: error instanceof Error ? error.message : "Falha ao aplicar desconto por categoria" };
    }
}

export async function applyDiscount(data: DiscountFormData) {
    try {
        const table = data.itemType === "menu" ? menuItems : drinks;
        const id = parseInt(data.itemId);

        // Validar desconto
        if (data.discount < 0 || data.discount > 100) {
            throw new Error("Desconto deve estar entre 0 e 100%");
        }

        // Validar datas
        if (data.startDate && data.endDate && data.startDate > data.endDate) {
            throw new Error("Data inicial deve ser anterior à data final");
        }

        // Buscar o item atual
        const currentItem = await db
            .select()
            .from(table)
            .where(eq(table.id, id))
            .limit(1);

        if (!currentItem.length) {
            throw new Error("Item não encontrado");
        }

        const item = currentItem[0];

        // Calcular preços com desconto
        const finalPrice = calculateDiscountedPrice(item.price, data.discount);
        const mediumFinalPrice = calculateDiscountedPrice(item.mediumSizePrice, data.discount);
        const largeFinalPrice = calculateDiscountedPrice(item.largeSizePrice, data.discount);

        // Atualizar o item com o desconto
        await db.update(table)
            .set({
                discount: data.discount.toString(),
                discountStartDate: data.startDate?.toISOString() || null,
                discountEndDate: data.endDate?.toISOString() || null,
                isDiscounted: true,
                finalPrice,
                mediumFinalPrice,
                largeFinalPrice,
            })
            .where(eq(table.id, id));

        revalidatePath('/menu');
        revalidatePath('/admin/menu');
        revalidatePath('/admin/discounts');

        return { success: true };
    } catch (error) {
        console.error("Error applying discount:", error);
        return { error: error instanceof Error ? error.message : "Falha ao aplicar desconto" };
    }
}

export async function removeDiscount(itemType: "menu" | "drink", itemId: number) {
    try {
        const table = itemType === "menu" ? menuItems : drinks;

        // Buscar o item atual
        const currentItem = await db
            .select()
            .from(table)
            .where(eq(table.id, itemId))
            .limit(1);

        if (!currentItem.length) {
            throw new Error("Item não encontrado");
        }

        await db.update(table)
            .set({
                discount: '0',
                discountStartDate: null,
                discountEndDate: null,
                isDiscounted: false,
                finalPrice: null,
                mediumFinalPrice: null,
                largeFinalPrice: null,
            })
            .where(eq(table.id, itemId));

        revalidatePath('/menu');
        revalidatePath('/admin/menu');
        revalidatePath('/admin/discounts');

        return { success: true };
    } catch (error) {
        console.error("Error removing discount:", error);
        return { error: error instanceof Error ? error.message : "Falha ao remover desconto" };
    }
}

export async function getActiveDiscounts() {
    try {
        const menuDiscounts = await db.select().from(menuItems).where(eq(menuItems.isDiscounted, true));
        const drinkDiscounts = await db.select().from(drinks).where(eq(drinks.isDiscounted, true));
        return { menu: menuDiscounts, drinks: drinkDiscounts };
    } catch (error) {
        console.error("Error fetching discounts:", error);
        return { error: error instanceof Error ? error.message : "Falha ao buscar descontos" };
    }
} 