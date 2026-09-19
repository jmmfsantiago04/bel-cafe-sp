"use client"

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
    <div className="flex min-h-0 flex-1 bg-[#F5E6D3]">
      <AdminSidebar />
      <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
        {children}
      </main>
    </div>
  )
}