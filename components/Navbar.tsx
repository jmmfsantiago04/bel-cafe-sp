import Link from "next/link"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"

interface SubMenuItem {
    title: string;
    href: string;
}

interface MenuItem {
    title: string;
    href?: string;
    submenu?: SubMenuItem[];
}

const menuItems: MenuItem[] = [
    {
        title: "Menu",
        submenu: [
            {
                title: "Café da Manhã",
                href: "/menu/cafe-manha",
            },
            {
                title: "Almoço",
                href: "/menu/almoco",
            },
            {
                title: "Jantar",
                href: "/menu/jantar",
            },
            {
                title: "Bebidas",
                href: "/menu/bebidas-quentes",
            },
        ]
    },
    {
        title: "Reservas",
        href: "/reservas",
    },
    {
        title: "Sobre Nós",
        href: "/sobre",
    },
    {
        title: "Dúvidas",
        href: "/duvidas",
    },
    {
        title: "Blog",
        href: "/blog",
    },
];

export function Navbar() {
    return (
        <nav className="w-full border-b bg-[#8B4513] py-4 sticky top-0 z-50" aria-label="Principal">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-[#F5DEB3] text-xl font-bold">
                        É de Chão
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <ul className="flex items-center space-x-6">
                            {menuItems.map((item) => (
                                <li key={item.title}>
                                    {item.submenu ? (
                                        <div className="relative group">
                                            <button
                                                className="text-[#F5DEB3] hover:text-[#DEB887] transition-colors py-2"
                                                aria-expanded="false"
                                                aria-haspopup="true"
                                            >
                                                {item.title}
                                            </button>
                                            <ul
                                                className="absolute top-full left-0 hidden group-hover:block bg-[#8B4513] rounded-md shadow-lg py-2 min-w-[200px]"
                                                role="menu"
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.href} role="none">
                                                        <Link
                                                            href={subItem.href}
                                                            className="block px-4 py-2 text-[#F5DEB3] hover:bg-[#654321] transition-colors"
                                                            role="menuitem"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ) : (
                                        <Link
                                            href={item.href!}
                                            className="text-[#F5DEB3] hover:text-[#DEB887] transition-colors"
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Mobile Navigation */}
                    <Sheet>
                        <SheetTrigger
                            className="md:hidden text-[#F5DEB3] hover:text-[#DEB887]"
                            aria-label="Abrir menu"
                        >
                            <Menu className="h-6 w-6" aria-hidden="true" />
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#8B4513] border-[#654321] p-0">
                            <header className="p-4 border-b border-[#654321]">
                                <SheetTitle className="text-[#F5DEB3] text-xl font-bold">
                                    É de Chão - Menu
                                </SheetTitle>
                            </header>
                            <nav className="flex-1 overflow-y-auto py-4" aria-label="Menu mobile">
                                <ul>
                                    {menuItems.map((item) => (
                                        <li key={item.title} className="px-4">
                                            {item.submenu ? (
                                                <div className="mb-4">
                                                    <h2 className="text-[#F5DEB3] font-semibold mb-2">
                                                        {item.title}
                                                    </h2>
                                                    <ul className="pl-4 space-y-2">
                                                        {item.submenu.map((subItem) => (
                                                            <li key={subItem.href}>
                                                                <Link
                                                                    href={subItem.href}
                                                                    className="block text-[#F5DEB3] hover:text-[#DEB887] transition-colors"
                                                                >
                                                                    {subItem.title}
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <Link
                                                    href={item.href!}
                                                    className="block text-[#F5DEB3] hover:text-[#DEB887] transition-colors py-2"
                                                >
                                                    {item.title}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
} 