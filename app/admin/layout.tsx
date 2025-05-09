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
        { name: 'Reservas', href: '/admin/reservations' },
        { name: 'Descontos', href: '/admin/discounts' },
        { name: 'Configurações', href: '/admin/settings' },
    ]

    return (
        <SidebarProvider>
            <div className="flex h-screen w-full overflow-hidden bg-[#FDF5E6]">
                <Sidebar className="border-r border-[#DEB887] bg-[#FDF5E6] w-72 flex-shrink-0">
                    <SidebarHeader>
                        <div className="p-6">
                            <h2 className="text-2xl font-bold text-[#8B4513] font-serif">Bel Café</h2>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className="text-[#D2691E]">☕</span>
                                <p className="text-[#D2691E] text-sm">Painel Administrativo</p>
                            </div>
                        </div>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu className="px-2">
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                        className={cn(
                                            "w-full px-4 py-3 text-sm font-medium rounded-md transition-colors",
                                            pathname === item.href
                                                ? "bg-[#8B4513] text-[#FAEBD7]"
                                                : "text-[#8B4513] hover:bg-[#DEB887] hover:text-[#8B4513]"
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
                <main className="flex-1 h-full p-8 overflow-y-auto bg-[#FDF5E6]">
                    <div className="h-full p-8">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
} 