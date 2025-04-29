'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu as MenuIcon } from "lucide-react"
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
        { name: 'Café da Manhã', href: '/menu/cafe-manha' },
        { name: 'Bebidas Quentes', href: '/menu/bebidas-quentes' },
        { name: 'Bebidas Geladas', href: '/menu/bebidas-frias' },
        { name: 'Salgados', href: '/menu/salgados' },
        { name: 'Doces', href: '/menu/doces' },
        { name: 'Sobremesas', href: '/menu/desserts' },
        { name: 'Pratos Especiais', href: '/menu/specials' },
    ]

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-[#FDF5E6]">
                {/* Mobile Menu Button */}
                <div className="fixed top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger>
                        <MenuIcon className="h-6 w-6 text-[#8B4513]" />
                    </SidebarTrigger>
                </div>

                {/* Sidebar */}
                <Sidebar
                    className="border-r border-[#DEB887] bg-[#FDF5E6] w-72 flex-shrink-0 fixed md:relative h-full"
                    collapsible="offcanvas"
                >
                    <SidebarHeader>
                        <div className="p-6">
                            <Link href="/menu" className="block">
                                <h2 className="text-2xl font-bold text-[#8B4513] font-serif">Bel Café</h2>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span className="text-[#D2691E]">☕</span>
                                    <p className="text-[#D2691E] text-sm">Cardápio</p>
                                </div>
                            </Link>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu className="px-2">
                            {menuCategories.map((category) => (
                                <SidebarMenuItem key={category.name}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === category.href}
                                        className={cn(
                                            "w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                            pathname === category.href
                                                ? "bg-[#8B4513] text-[#FAEBD7]"
                                                : "text-[#8B4513] hover:bg-[#DEB887] hover:text-[#8B4513]"
                                        )}
                                    >
                                        <Link href={category.href}>
                                            {category.name}
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 min-h-screen w-full overflow-y-auto bg-[#FDF5E6] md:pl-0 pt-16 md:pt-0">
                    <div className="p-4 md:p-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
} 