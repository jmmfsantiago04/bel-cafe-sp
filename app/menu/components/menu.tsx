"use client";

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { menuItems } from "@/db/schema";
import { type InferSelectModel } from "drizzle-orm";
import { Coffee, UtensilsCrossed } from "lucide-react";

type MenuItem = InferSelectModel<typeof menuItems>;

interface MenuProps {
    initialItems: {
        salgados: MenuItem[];
        doces: MenuItem[];
        cafeDaManha: MenuItem[];
    };
}

const formatPrice = (price: string) => {
    return Number(price).toFixed(2);
};

const categories = [
    { id: 'salgados', name: 'Salgados', icon: '🥨' },
    { id: 'doces', name: 'Doces', icon: '🍰' },
    { id: 'cafeDaManha', name: 'Café da Manhã', icon: '☕' },
];

export function Menu({ initialItems }: MenuProps) {
    return (
        <div className="w-full">
            <Tabs defaultValue="salgados" className="w-full">
                <div className="relative">
                    <ScrollArea className="w-full pb-4">
                        <TabsList className="w-full h-auto justify-start gap-2 bg-transparent p-0">
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="data-[state=active]:bg-[#8B4513] data-[state=active]:text-white 
                                             bg-[#FAEBD7] text-[#8B4513] rounded-full px-6 py-2 
                                             hover:bg-[#DEB887] transition-colors font-serif"
                                >
                                    {category.icon} {category.name}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </ScrollArea>
                    <div className="absolute bottom-0 w-full h-[1px] bg-[#DEB887]" />
                </div>

                {categories.map((category) => (
                    <TabsContent
                        key={category.id}
                        value={category.id}
                        className="mt-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {initialItems[category.id as keyof typeof initialItems]?.map((item) => (
                                <Card key={item.id} className="overflow-hidden border-[#DEB887] bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    {category.icon && (
                                                        <span className="text-[#8B4513]">{category.icon}</span>
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
                                        <div className="mt-3 flex flex-wrap items-center gap-2">
                                            {item.isPopular && (
                                                <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full font-medium font-serif">
                                                    ⭐ Mais Pedido
                                                </span>
                                            )}
                                            {category.id === 'doces' && item.isSugarFree && (
                                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium font-serif">
                                                    🍯 Sem Açúcar
                                                </span>
                                            )}
                                        </div>
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
                            {initialItems[category.id as keyof typeof initialItems]?.length === 0 && (
                                <div className="col-span-full text-center py-8">
                                    <p className="text-[#8B4513] text-lg font-serif">
                                        Nenhum item disponível nesta categoria no momento.
                                    </p>
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
} 