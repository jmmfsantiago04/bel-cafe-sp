'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu as MenuIcon, Coffee, Soup, IceCream2, Sandwich, Candy, Cake, ChefHat, UtensilsCrossed, Utensils } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"

export default function MenuLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const menuCategories = [
        { name: 'Café da Manhã', href: '/menu/cafe-manha', icon: Coffee },
        { name: 'Almoço', href: '/menu/almoco', icon: UtensilsCrossed },
        { name: 'Jantar', href: '/menu/jantar', icon: Utensils },
        { name: 'Bebidas Quentes', href: '/menu/bebidas-quentes', icon: Soup },
        { name: 'Bebidas Geladas', href: '/menu/bebidas-frias', icon: IceCream2 },
        { name: 'Salgados', href: '/menu/salgados', icon: Sandwich },
        { name: 'Doces', href: '/menu/doces', icon: Candy },
        { name: 'Sobremesas', href: '/menu/sobremesas', icon: Cake },
        { name: 'Pratos Especiais', href: '/menu/specials', icon: ChefHat },
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-gradient-to-br from-[#F5E6D3] via-[#F5E6D3] to-[#F4861F]/10">
                {/* Mobile Menu Button */}
                <div className="fixed top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger>
                        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
                            <MenuIcon className="h-6 w-6 text-[#C84C28] hover:text-[#2B4C5C] transition-colors" />
                        </div>
                    </SidebarTrigger>
                </div>

                {/* Sidebar */}
                <Sidebar
                    className="border-r border-[#F4861F]/20 bg-[#F5E6D3]/95 backdrop-blur-sm w-72 flex-shrink-0 fixed md:relative h-full shadow-xl"
                    collapsible="offcanvas"
                >
                    <SidebarHeader>
                        <div className="p-8 bg-gradient-to-r from-[#2B4C5C] to-[#2B4C5C]/90 text-[#F5E6D3] rounded-b-3xl shadow-lg">
                            <Link href="/menu" className="block group">
                                <h2 className="text-3xl font-bold font-serif text-center group-hover:text-[#FFB800] transition-colors">É de Chão</h2>
                                <div className="flex items-center justify-center space-x-2 mt-3">
                                    <span className="text-[#FFB800] text-2xl group-hover:scale-110 transition-transform">☕</span>
                                    <p className="text-sm font-medium text-[#FFB800]">Comida de Afeto</p>
                                </div>
                            </Link>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <div className="mt-6 px-4 text-[#2B4C5C]/70 text-sm font-medium">
                            Cardápio
                        </div>
                        <SidebarMenu className="px-4 py-4">
                            {menuCategories.map((category) => {
                                const Icon = category.icon
                                return (
                                    <SidebarMenuItem key={category.name} className="mb-2">
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === category.href}
                                            className={cn(
                                                "w-full px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-3",
                                                pathname === category.href
                                                    ? "bg-gradient-to-r from-[#C84C28] to-[#F4861F] text-[#F5E6D3] shadow-md transform scale-105"
                                                    : "text-[#2B4C5C] hover:bg-[#FFB800]/20 hover:text-[#2B4C5C] hover:shadow-sm"
                                            )}
                                        >
                                            <Link href={category.href} className="flex items-center gap-3 w-full">
                                                <Icon className="h-5 w-5" />
                                                {category.name}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 min-h-screen w-full overflow-y-auto bg-transparent">
                    <div className="pb-6  max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
} 