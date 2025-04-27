'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
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

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navigation = [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Cardápio', href: '/admin/menu' },
        { name: 'Categorias', href: '/admin/categories' },
        { name: 'Configurações', href: '/admin/settings' },
    ]

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-[#FDF5E6]">
                <div className="flex">
                    <Sidebar>
                        <SidebarHeader>
                            <div className="mb-8 px-4">
                                <h2 className="text-2xl font-bold text-white font-serif">Bel Café</h2>
                                <p className="text-[#DEB887] text-sm">Painel Administrativo</p>
                            </div>
                        </SidebarHeader>
                        <SidebarContent className="bg-[#8B4513]">
                            <SidebarMenu>
                                {navigation.map((item) => (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={pathname === item.href}
                                            className={cn(
                                                "w-full",
                                                pathname === item.href
                                                    ? "bg-[#654321] text-white"
                                                    : "text-[#DEB887] hover:bg-[#654321] hover:text-white"
                                            )}
                                        >
                                            <Link href={item.href}>
                                                {item.name}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarContent>
                    </Sidebar>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {children}
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
} 