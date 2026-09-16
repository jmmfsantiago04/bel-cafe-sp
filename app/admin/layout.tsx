'use client'

import { usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Login page: no admin chrome
    if (pathname === "/admin/login") {
        return <>{children}</>
    }

    return (
        <div className="min-h-screen flex bg-[#F5E6D3]">
            <AdminSidebar />
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
