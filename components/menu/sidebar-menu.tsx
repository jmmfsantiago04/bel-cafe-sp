'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Coffee, Soup, IceCream2, Sandwich, Candy, Cake, ChefHat, UtensilsCrossed, Utensils } from "lucide-react"
import { useMenuCategories } from "./menu-categories-context"

// Mapa de ícones para cada tipo de categoria
const categoryIcons = {
    'cafe-manha': Coffee,
    'almoco': UtensilsCrossed,
    'jantar': Utensils,
    'bebidas-quentes': Soup,
    'bebidas-frias': IceCream2,
    'salgados': Sandwich,
    'doces': Candy,
    'sobremesas': Cake,
    'specials': ChefHat,
} as const

export function SidebarMenu() {
    const pathname = usePathname()
    const { categories } = useMenuCategories()

    // Filtra apenas categorias ativas e ordena por displayOrder
    const activeCategories = categories
        .filter(cat => cat.isActive)
        .sort((a, b) => a.displayOrder - b.displayOrder)

    return (
        <div className="flex h-full min-h-screen w-64 sm:w-72 flex-col bg-[#F5E6D3]/95 backdrop-blur-sm border-r border-[#F4861F]/20 shadow-xl">
            <div className="p-6 sm:p-8 bg-gradient-to-r from-[#2B4C5C] to-[#2B4C5C]/90 text-[#F5E6D3] rounded-b-3xl shadow-lg">
                <Link href="/menu" className="block group">
                    <h2 className="text-2xl sm:text-3xl font-bold font-serif text-center group-hover:text-[#FFB800] transition-colors">
                        É de Chão
                    </h2>
                    <div className="flex items-center justify-center space-x-2 mt-2 sm:mt-3">
                        <span className="text-[#FFB800] text-xl sm:text-2xl group-hover:scale-110 transition-transform" aria-hidden="true">☕</span>
                        <p className="text-xs sm:text-sm font-medium text-[#FFB800]">Comida de Afeto</p>
                    </div>
                </Link>
            </div>

            <div className="mt-4 sm:mt-6 px-4 text-[#2B4C5C]/70 text-xs sm:text-sm font-medium">
                Cardápio
            </div>

            <nav className="flex-1 px-4 py-3 sm:py-4">
                {activeCategories.map((category) => {
                    const Icon = categoryIcons[category.slug as keyof typeof categoryIcons] || ChefHat
                    const isActive = pathname === `/menu/${category.slug}`

                    return (
                        <Link
                            key={category.id}
                            href={`/menu/${category.slug}`}
                            className={cn(
                                "flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 mb-1.5 sm:mb-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-[#C84C28] to-[#F4861F] text-[#F5E6D3] shadow-md transform scale-105"
                                    : "text-[#2B4C5C] hover:bg-[#FFB800]/20 hover:text-[#2B4C5C] hover:shadow-sm"
                            )}
                        >
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                            {category.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}