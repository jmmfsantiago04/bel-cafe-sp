"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { categories, menuItems } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { Coffee, UtensilsCrossed } from "lucide-react";

type Category = InferSelectModel<typeof categories>;
type MenuItem = InferSelectModel<typeof menuItems>;

interface MenuProps {
    initialCategories: Category[];
    initialMenuItems: Record<number, MenuItem[]>;
}

const formatPrice = (price: string | number | null | undefined) => {
    if (price === null || price === undefined) return "0,00";
    const numericPrice = typeof price === "string" ? parseFloat(price) : price;
    return numericPrice.toFixed(2).replace(".", ",");
};

export function Menu({ initialCategories, initialMenuItems }: MenuProps) {
    if (initialCategories.length === 0) {
        return (
            <div className="w-full space-y-4 p-4">
                <p className="text-center text-muted-foreground">Nenhuma categoria disponível</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <Tabs defaultValue={initialCategories[0]?.id.toString()} className="w-full">
                <div className="relative">
                    <ScrollArea className="w-full pb-4">
                        <TabsList className="w-full h-auto justify-start gap-2 bg-transparent p-0">
                            {initialCategories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id.toString()}
                                    className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white 
                                             bg-[#FAEBD7] text-[#8B4513] rounded-full px-6 py-2 
                                             hover:bg-[#DEB887] transition-colors font-serif"
                                >
                                    {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                    <div className="absolute bottom-0 w-full h-[1px] bg-[#DEB887]" />
                </div>

                {initialCategories.map((category) => (
                    <TabsContent
                        key={category.id}
                        value={category.id.toString()}
                        className="mt-8"
                    >
                        {category.description && (
                            <div className="text-center mb-8">
                                <p className="text-[#8B4513] italic font-serif">
                                    {category.description}
                                </p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {initialMenuItems[category.id]?.map((item) => (
                                <Card key={item.id} className="overflow-hidden border-[#DEB887] bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {item.categoryId === 1 ? (
                                                        <Coffee className="w-5 h-5 text-[#8B4513]" />
                                                    ) : (
                                                        <UtensilsCrossed className="w-5 h-5 text-[#8B4513]" />
                                                    )}
                                                    <h3 className="text-xl font-bold text-[#8B4513] font-serif">{item.name}</h3>
                                                </div>
                                                {item.description && (
                                                    <p className="text-[#A0522D] mt-2 font-serif">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                            {item.imageUrl && (
                                                <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-[#DEB887]">
                                                    <img
                                                        src={item.imageUrl}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-4 font-serif">
                                            {item.hasSize ? (
                                                <div className="space-y-1.5">
                                                    <p className="text-[#8B4513]">
                                                        <span className="font-medium">P:</span> R$ {formatPrice(item.finalPrice || item.price)}
                                                    </p>
                                                    {item.mediumSizePrice && (
                                                        <p className="text-[#8B4513]">
                                                            <span className="font-medium">M:</span> R$ {formatPrice(item.mediumFinalPrice || item.mediumSizePrice)}
                                                        </p>
                                                    )}
                                                    {item.largeSizePrice && (
                                                        <p className="text-[#8B4513]">
                                                            <span className="font-medium">G:</span> R$ {formatPrice(item.largeFinalPrice || item.largeSizePrice)}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-[#8B4513]">
                                                    R$ {formatPrice(item.finalPrice || item.price)}
                                                </p>
                                            )}
                                        </div>
                                        {item.isPopular && (
                                            <div className="mt-3 flex items-center gap-1">
                                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium font-serif">
                                                    ⭐ Mais Pedido
                                                </span>
                                            </div>
                                        )}
                                        {/* Dietary Preferences */}
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            {item.isGlutenFree && (
                                                <span className="inline-block px-3 py-1 bg-orange-50 text-orange-800 text-xs rounded-full font-medium font-serif">
                                                    🌾 Sem Glúten
                                                </span>
                                            )}
                                            {item.isVegetarian && (
                                                <span className="inline-block px-3 py-1 bg-green-50 text-green-800 text-xs rounded-full font-medium font-serif">
                                                    🥬 Vegetariano
                                                </span>
                                            )}
                                            {item.isVegan && (
                                                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs rounded-full font-medium font-serif">
                                                    🌱 Vegano
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
} 