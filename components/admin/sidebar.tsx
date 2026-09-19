"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import {
  Building2,
  Clock,
  Home,
  LogOut,
  Menu as MenuIcon,
  PanelLeft,
  Settings,
  Users,
  BookOpen,
  HelpCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Cardápio", href: "/admin/menu", icon: MenuIcon },
  { name: "Blog", href: "/admin/blog", icon: BookOpen },
  { name: "Categorias", href: "/admin/categories", icon: Building2 },
  { name: "Horários", href: "/admin/hours", icon: Clock },
  { name: "Reservas", href: "/admin/reservations", icon: Users },
  { name: "Dúvidas", href: "/admin/duvidas", icon: HelpCircle },
  { name: "Sobre Nós", href: "/admin/sobre-nos", icon: Building2 },
  { name: "Configurações", href: "/admin/settings", icon: Settings },
]

function AdminNavPanel({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  async function handleLogout() {
    onNavigate?.()
    await signOut({ redirect: true, callbackUrl: "/admin/login" })
  }

  return (
    <div className="flex h-full w-full flex-col bg-[#4A2512]">
      <div className="flex h-16 items-center px-6">
        <Link
          href="/admin"
          onClick={() => onNavigate?.()}
          className="flex items-center gap-2 font-semibold text-white"
        >
          <Building2 className="h-6 w-6" />
          <span>É de Chão Admin</span>
        </Link>
      </div>

      <div className="flex-1 space-y-1 overflow-y-auto px-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => onNavigate?.()}
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

      <div className="space-y-2 border-t border-white/10 p-3">
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
          onClick={() => onNavigate?.()}
          className="block text-center text-xs text-white/50 hover:text-white/80"
        >
          Sair (alternativo)
        </Link>
      </div>
    </div>
  )
}

export function AdminSidebar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="flex items-center gap-3 border-b border-[#4A2512]/15 bg-[#F5E6D3] px-4 py-3 md:hidden">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="border-[#4A2512]/30 bg-white/70"
          onClick={() => setOpen(true)}
          aria-label="Abrir menu"
        >
          <PanelLeft className="h-5 w-5 text-[#4A2512]" />
        </Button>
        <span className="font-semibold text-[#4A2512]">Admin</span>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-72 border-0 bg-[#4A2512] p-0 text-white [&>button]:text-white"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu admin</SheetTitle>
          </SheetHeader>
          <AdminNavPanel onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <aside className="hidden md:flex md:w-72 md:shrink-0 md:flex-col">
        <AdminNavPanel />
      </aside>
    </>
  )
}