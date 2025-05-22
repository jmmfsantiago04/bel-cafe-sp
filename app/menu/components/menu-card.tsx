'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Wheat, Carrot, ImageOff } from "lucide-react"

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
                    <div className="flex items-center gap-1.5 sm:gap-2">
                        <span className="text-base sm:text-lg md:text-xl font-bold text-[#C84C28]">
                            {formatPrice(finalPrice)}
                        </span>
                        <Badge variant="outline" className="text-xs sm:text-sm font-medium text-[#C84C28] bg-[#C84C28]/10">
                            {item.discount}% OFF
                        </Badge>
                    </div>
                    <span
                        className="text-xs sm:text-sm line-through text-[#8B4513]/60"
                        aria-label={`Preço original: ${formatPrice(originalPrice)}`}
                    >
                        {formatPrice(originalPrice)}
                    </span>
                </div>
            );
        }

        return (
            <span className="text-base sm:text-lg md:text-xl font-bold text-[#4A2512]">
                {formatPrice(originalPrice)}
            </span>
        );
    };

    return (
        <Card className="group overflow-hidden bg-white shadow-md hover:shadow-lg transition-all duration-300 border-[#DEB887]/20">
            <figure className="relative h-40 sm:h-48 md:h-56">
                {item.imageUrl ? (
                    <>
                        <img
                            src={item.imageUrl}
                            alt={`Foto do prato ${item.name}`}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                        />
                        {item.isDiscounted && (
                            <div
                                className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                                aria-hidden="true"
                            />
                        )}
                    </>
                ) : (
                    <div className="h-full bg-[#F5E6D3] flex items-center justify-center" aria-label="Imagem não disponível">
                        <ImageOff className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-[#8B4513]/40" aria-hidden="true" />
                    </div>
                )}
            </figure>

            <CardHeader className="pb-2 space-y-2 sm:space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg sm:text-xl md:text-2xl text-[#4A2512] group-hover:text-[#C84C28] transition-colors">
                        {item.name}
                    </CardTitle>
                    {item.isPopular && (
                        <Badge
                            variant="outline"
                            className="text-xs sm:text-sm bg-[#FFB800]/10 text-[#8B4513] border-[#FFB800]"
                            aria-label="Item popular"
                        >
                            Popular
                        </Badge>
                    )}
                </div>
                {item.description && (
                    <CardDescription className="text-sm sm:text-base text-[#8B4513]/80 line-clamp-2">
                        {item.description}
                    </CardDescription>
                )}
            </CardHeader>

            <CardContent>
                <div className="space-y-3 sm:space-y-4">
                    {/* Dietary Preferences */}
                    <div
                        className="flex flex-wrap gap-1 sm:gap-1.5 md:gap-2"
                        role="list"
                        aria-label="Informações dietéticas"
                    >
                        {item.isGlutenFree && (
                            <Badge
                                variant="outline"
                                className="text-xs sm:text-sm bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors"
                                role="listitem"
                            >
                                <Wheat className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                                Sem Glúten
                            </Badge>
                        )}
                        {item.isVegetarian && (
                            <Badge
                                variant="outline"
                                className="text-xs sm:text-sm bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors"
                                role="listitem"
                            >
                                <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                                Vegetariano
                            </Badge>
                        )}
                        {item.isVegan && (
                            <Badge
                                variant="outline"
                                className="text-xs sm:text-sm bg-[#4A2512]/5 border-[#4A2512]/20 text-[#4A2512] hover:bg-[#4A2512]/10 transition-colors"
                                role="listitem"
                            >
                                <Carrot className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" aria-hidden="true" />
                                Vegano
                            </Badge>
                        )}
                    </div>

                    {/* Price */}
                    <div className="pt-2" aria-label="Informações de preço">
                        {renderPrice(item.price, item.finalPrice)}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
} 