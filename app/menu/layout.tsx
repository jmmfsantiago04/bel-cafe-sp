"use client"

import { SidebarProvider, Sidebar, SidebarTrigger } from "@/components/ui/sidebar"
import { MenuIcon } from "lucide-react"
import { SidebarMenu } from "@/app/menu/components/sidebar-menu"

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-0 w-full flex-1 bg-gradient-to-br from-[#FFF8EC] via-[#FFF8EC] to-[#F4861F]/10">
        <div className="fixed left-4 top-20 z-40 md:hidden">
          <SidebarTrigger aria-label="Abrir menu de navegação">
            <div className="rounded-lg bg-white/80 p-2 shadow-md backdrop-blur-sm">
              <MenuIcon
                className="h-5 w-5 text-[#C84C28] transition-colors hover:text-[#2B4C5C] sm:h-6 sm:w-6"
                aria-hidden="true"
              />
            </div>
          </SidebarTrigger>
        </div>

        <Sidebar
          className="h-full w-64 flex-shrink-0 border-r border-[#F4861F]/20 bg-transparent shadow-xl backdrop-blur-sm fixed md:relative sm:w-72"
          collapsible="offcanvas"
        >
          <SidebarMenu />
        </Sidebar>

        <main className="min-h-0 w-full flex-1 overflow-y-auto bg-transparent">
          <div className="mx-auto max-w-7xl pb-6 pt-16 md:pt-0">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}