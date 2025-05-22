'use client'

import { GlobalMenuCategoriesProvider } from "./menu-categories-provider"

export function RootProvider({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <GlobalMenuCategoriesProvider>
            {children}
        </GlobalMenuCategoriesProvider>
    )
} 