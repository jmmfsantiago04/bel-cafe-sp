'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type InferModel } from "drizzle-orm"
import { menuItems } from "@/db/schema"
import { Leaf, Wheat, Carrot, ImageOff } from "lucide-react"

type MenuItem = InferModel<typeof menuItems>

interface MenuCardProps {
    item: {
        id: number
        name: string
        description: string | null
        price: string
        imageUrl: string | null
        isAvailable: boolean
        isPopular: boolean
        isDoce: boolean
        isGlutenFree: boolean
        isVegetarian: boolean
        isVegan: boolean
        discount: string
        isDiscounted: boolean
        finalPrice: string | null
    }
}

export function MenuCard({ item }: MenuCardProps) {
    const formatPrice = (price: string | null) => {
        if (!price) return null;
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(parseFloat(price));
    };

    const renderPrice = (originalPrice: string | null, finalPrice: string | null) => {
        if (!originalPrice) return null;

        if (item.isDiscounted && finalPrice) {
            return (
                <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-[#C84C28]">
                            {formatPrice(finalPrice)}
                        </span>
                        <span className="text-sm font-medium text-[#C84C28] bg-[#C84C28]/10 px-2 py-0.5 rounded-full">
                            {item.discount}% OFF
                        </span>
                    </div>
                    <span className="text-sm line-through text-[#8B4513]/60">
                        {formatPrice(originalPrice)}
                    </span>
                </div>
            );
        }

        return (
            <span className="text-lg font-bold text-[#4A2512]">
                {formatPrice(originalPrice)}
            </span>
        );
    };

    return (
        <Card className="group overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 border-[#DEB887]/20">
            {item.imageUrl ? (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                    {item.isDiscounted && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    )}
                </div>
            ) : (
                <div className="h-48 bg-[#F5E6D3] flex items-center justify-center">
                    <ImageOff className="w-12 h-12 text-[#8B4513]/40" />
                </div>
            )}
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl text-[#4A2512] group-hover:text-[#C84C28] transition-colors">
                        {item.name}
                    </CardTitle>
                    {item.isPopular && (
                        <Badge variant="outline" className="bg-[#FFB800]/10 text-[#8B4513] border-[#FFB800]">
                            Popular
                        </Badge>
                    )}
                </div>
                {item.description && (
                    <CardDescription className="text-[#8B4513]/80 line-clamp-2">
                        {item.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Dietary Preferences */}
                    <div className="flex flex-wrap gap-1.5">
                        {item.isGlutenFree && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors">
                                <Wheat className="w-3 h-3 mr-1" />
                                Sem Glúten
                            </Badge>
                        )}
                        {item.isVegetarian && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors">
                                <Leaf className="w-3 h-3 mr-1" />
                                Vegetariano
                            </Badge>
                        )}
                        {item.isVegan && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors">
                                <Carrot className="w-3 h-3 mr-1" />
                                Vegano
                            </Badge>
                        )}
                    </div>

                    {/* Price */}
                    <div className="pt-2">
                        {renderPrice(item.price, item.finalPrice)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 