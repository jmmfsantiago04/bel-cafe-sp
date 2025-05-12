'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Coffee, Wine, Leaf, Wheat, Carrot, ImageOff } from "lucide-react"

interface DrinkCardProps {
    item: {
        id: number
        name: string
        description: string | null
        price: string
        imageUrl: string | null
        isHotDrink: boolean
        isAvailable: boolean
        isPopular: boolean
        isAlcoholic: boolean
        hasSize: boolean
        mediumSizePrice: string | null
        largeSizePrice: string | null
        isGlutenFree: boolean
        isVegetarian: boolean
        isVegan: boolean
        discount: string
        isDiscounted: boolean
        finalPrice: string | null
        mediumFinalPrice: string | null
        largeFinalPrice: string | null
    }
}

export function DrinkCard({ item }: DrinkCardProps) {
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
                    <div className="flex flex-wrap gap-1.5">
                        {item.isPopular && (
                            <Badge variant="outline" className="bg-[#FFB800]/10 text-[#8B4513] border-[#FFB800]">
                                Popular
                            </Badge>
                        )}
                        {item.isAlcoholic && (
                            <Badge variant="outline" className="bg-[#C84C28]/10 text-[#C84C28] border-[#C84C28] hover:bg-[#C84C28]/20 transition-colors">
                                <Wine className="w-3 h-3 mr-1" />
                                18+
                            </Badge>
                        )}
                        {item.isHotDrink && (
                            <Badge variant="outline" className="bg-[#8B4513]/10 text-[#8B4513] border-[#8B4513] hover:bg-[#8B4513]/20 transition-colors">
                                <Coffee className="w-3 h-3 mr-1" />
                                Quente
                            </Badge>
                        )}
                    </div>
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

                    {/* Prices */}
                    <div className={cn(
                        "grid gap-4 pt-2",
                        item.hasSize ? "grid-cols-3" : "grid-cols-1"
                    )}>
                        {!item.hasSize && (
                            <div>
                                {renderPrice(item.price, item.finalPrice)}
                            </div>
                        )}

                        {item.hasSize && (
                            <>
                                <div>
                                    <p className="text-sm font-medium text-[#8B4513]/80 mb-1">Pequeno</p>
                                    {renderPrice(item.price, item.finalPrice)}
                                </div>
                                {item.mediumSizePrice && (
                                    <div>
                                        <p className="text-sm font-medium text-[#8B4513]/80 mb-1">Médio</p>
                                        {renderPrice(item.mediumSizePrice, item.mediumFinalPrice)}
                                    </div>
                                )}
                                {item.largeSizePrice && (
                                    <div>
                                        <p className="text-sm font-medium text-[#8B4513]/80 mb-1">Grande</p>
                                        {renderPrice(item.largeSizePrice, item.largeFinalPrice)}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 