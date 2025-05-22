'use client'

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
            <div className="flex min-h-screen w-full bg-gradient-to-br from-[#F5E6D3] via-[#F5E6D3] to-[#F4861F]/10">
                {/* Mobile Menu Button */}
                <div className="fixed top-4 left-4 z-50 md:hidden">
                    <SidebarTrigger aria-label="Abrir menu de navegação">
                        <div className="bg-white/80 backdrop-blur-sm p-2 rounded-lg shadow-md">
                            <MenuIcon className="h-5 w-5 sm:h-6 sm:w-6 text-[#C84C28] hover:text-[#2B4C5C] transition-colors" aria-hidden="true" />
                        </div>
                    </SidebarTrigger>
                </div>

                {/* Sidebar */}
                <Sidebar
                    className="border-r border-[#F4861F]/20 bg-transparent backdrop-blur-sm w-64 sm:w-72 flex-shrink-0 fixed md:relative h-full shadow-xl"
                    collapsible="offcanvas"
                >
                    <SidebarMenu />
                </Sidebar>

                {/* Main Content */}
                <main className="flex-1 min-h-screen w-full overflow-y-auto bg-transparent">
                    <div className="pb-6 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </SidebarProvider>
    )
} 