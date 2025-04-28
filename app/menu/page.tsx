import { Menu } from "@/components/menu/menu";
import { db } from "@/lib/db";
import { categories, menuItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function MenuPage() {
    // Fetch categories
    const fetchedCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.isActive, true));

    // Fetch menu items for each category
    const items: Record<number, any[]> = {};
    for (const category of fetchedCategories) {
        const categoryItems = await db
            .select()
            .from(menuItems)
            .where(
                and(
                    eq(menuItems.categoryId, category.id),
                    eq(menuItems.isAvailable, true)
                )
            );
        items[category.id] = categoryItems;
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-[#F5DEB3] to-[#FFEFD5] py-12">
            <div className="container mx-auto">
                {/* Decorative Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-[#8B4513] mb-4 font-serif">
                        Bel Café
                    </h1>
                    <div className="flex items-center justify-center space-x-4">
                        <div className="h-[2px] w-24 bg-[#DEB887]" />
                        <span className="text-[#D2691E] font-serif">☕</span>
                        <div className="h-[2px] w-24 bg-[#DEB887]" />
                    </div>
                </div>

                {/* Menu Component */}
                <Menu initialCategories={fetchedCategories} initialMenuItems={items} />

                {/* Decorative Footer */}
                <div className="flex items-center justify-center mt-12 space-x-4">
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                    <span className="text-[#D2691E] font-serif">♦</span>
                    <div className="h-[2px] w-24 bg-[#DEB887]" />
                </div>
            </div>
        </main>
    );
} 