'use client'

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { Building2, Clock, Home, LogOut, Menu, Settings, Users, BookOpen, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
    {
        name: "Dashboard",
        href: "/admin",
        icon: Home
    },
    {
        name: "Cardápio",
        href: "/admin/menu",
        icon: Menu
    },
    {
        name: "Blog",
        href: "/admin/blog",
        icon: BookOpen
    },
    {
        name: "Categorias",
        href: "/admin/categories",
        icon: Building2
    },
    {
        name: "Horários",
        href: "/admin/hours",
        icon: Clock
    },
    {
        name: "Reservas",
        href: "/admin/reservations",
        icon: Users
    },
    {
        name: "Dúvidas",
        href: "/admin/duvidas",
        icon: HelpCircle
    },
    {
        name: "Sobre Nós",
        href: "/admin/sobre-nos",
        icon: Building2
    },
    {
        name: "Configurações",
        href: "/admin/settings",
        icon: Settings
    }
]

export function AdminSidebar() {
    const pathname = usePathname()

    async function handleLogout() {
        await signOut({ redirect: true, callbackUrl: "/admin/login" })
    }

    return (
        <div className="flex h-full min-h-screen w-72 flex-col bg-[#4A2512]">
            <div className="flex h-16 items-center px-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold text-white">
                    <Building2 className="h-6 w-6" />
                    <span>Bel Café Admin</span>
                </Link>
            </div>

            <div className="flex-1 space-y-1 px-3">
                {navigation.map((item) => {
                    const isActive = pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-[#8B4513] hover:text-white",
                                isActive ? "bg-[#8B4513] text-white" : "text-white/80"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    )
                })}
            </div>

            <div className="border-t border-white/10 p-3 space-y-2">
                <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-start gap-3 text-white/80 hover:bg-[#8B4513] hover:text-white"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    Sair
                </Button>
                <Link
                    href="/admin/logout"
                    className="block text-center text-xs text-white/50 hover:text-white/80"
                >
                    Sair (alternativo)
                </Link>
            </div>
        </div>
    )
}
