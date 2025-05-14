'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Toaster } from "sonner"
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
import { AdminSidebar } from "@/components/admin/sidebar"

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
        <div className="min-h-screen flex bg-[#F5E6D3]">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
} 