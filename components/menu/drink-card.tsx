'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
                <div className="flex items-center gap-2">
                    <span className="text-sm line-through text-[#8B4513]/60">
                        {formatPrice(originalPrice)}
                    </span>
                    <span className="text-lg font-bold text-[#C84C28]">
                        {formatPrice(finalPrice)}
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
        <Card className="overflow-hidden bg-white shadow-md hover:shadow-lg transition-shadow">
            {item.imageUrl && (
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                    {item.isDiscounted && (
                        <div className="absolute top-2 right-2 bg-[#C84C28] text-white px-2 py-1 rounded-full text-sm font-bold">
                            {item.discount}% OFF
                        </div>
                    )}
                </div>
            )}
            <CardHeader>
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-xl text-[#4A2512]">{item.name}</CardTitle>
                    <div className="flex flex-wrap gap-1">
                        {item.isPopular && (
                            <Badge variant="outline" className="bg-[#FFB800]/10 text-[#8B4513] border-[#FFB800]">
                                Popular
                            </Badge>
                        )}
                        {item.isAlcoholic && (
                            <Badge variant="outline" className="bg-[#C84C28]/10 text-[#C84C28] border-[#C84C28]">
                                18+
                            </Badge>
                        )}
                    </div>
                </div>
                {item.description && (
                    <CardDescription className="text-[#8B4513]/80">
                        {item.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {/* Dietary Preferences */}
                    <div className="flex flex-wrap gap-1">
                        {item.isGlutenFree && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512]">
                                Sem Glúten
                            </Badge>
                        )}
                        {item.isVegetarian && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512]">
                                Vegetariano
                            </Badge>
                        )}
                        {item.isVegan && (
                            <Badge variant="outline" className="bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512]">
                                Vegano
                            </Badge>
                        )}
                    </div>

                    {/* Prices */}
                    <div className={cn(
                        "grid gap-2",
                        item.hasSize ? "grid-cols-3" : "grid-cols-1"
                    )}>
                        {!item.hasSize && (
                            <div>
                                <p className="text-sm text-[#8B4513]/80">Preço</p>
                                {renderPrice(item.price, item.finalPrice)}
                            </div>
                        )}

                        {item.hasSize && (
                            <>
                                <div>
                                    <p className="text-sm text-[#8B4513]/80">Pequeno</p>
                                    {renderPrice(item.price, item.finalPrice)}
                                </div>
                                {item.mediumSizePrice && (
                                    <div>
                                        <p className="text-sm text-[#8B4513]/80">Médio</p>
                                        {renderPrice(item.mediumSizePrice, item.mediumFinalPrice)}
                                    </div>
                                )}
                                {item.largeSizePrice && (
                                    <div>
                                        <p className="text-sm text-[#8B4513]/80">Grande</p>
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