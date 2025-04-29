import { db } from "@/lib/db";
import { categories, menuItems } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export default async function BreakfastPage() {
    // Fetch breakfast category
    const category = await db
        .select()
        .from(categories)
        .where(
            and(
                eq(categories.name, "Café da Manhã"),
                eq(categories.isActive, true)
            )
        )
        .then(rows => rows[0]);

    if (!category) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-[#8B4513]">
                    Categoria não encontrada
                </h2>
            </div>
        );
    }

    // Fetch breakfast items
    const breakfastItems = await db
        .select()
        .from(menuItems)
        .where(
            and(
                eq(menuItems.categoryId, category.id),
                eq(menuItems.isAvailable, true)
            )
        );

    return (
        <div className="container mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-[#8B4513] mb-2 font-serif">
                    Café da Manhã
                </h2>
                <p className="text-[#D2691E]">
                    Comece seu dia com nossas deliciosas opções de café da manhã
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {breakfastItems.map((item) => (
                    <div
                        key={item.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                    >
                        {item.imageUrl && (
                            <div className="relative h-48">
                                <img
                                    src={item.imageUrl}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#8B4513] mb-2">
                                {item.name}
                            </h3>
                            <p className="text-[#D2691E] text-sm mb-3">
                                {item.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-[#8B4513] font-bold">
                                    R$ {Number(item.price).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
} 