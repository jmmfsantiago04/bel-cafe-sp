import Link from "next/link"
import Image from "next/image"
import { Menu } from "lucide-react"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
} from "@/components/ui/sheet"
import { StoreStatus } from "@/components/StoreStatus"

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
        href: "/sobre-nos",
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
        <nav className="sticky top-0 z-50 w-full border-b border-[#7E3117] bg-[#B43D16] py-4" aria-label="Principal">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-[#FDE5B9] transition-colors hover:text-[#FFB902]"
                    >
                        <Image
                            src="/logo-icon.png"
                            alt=""
                            width={36}
                            height={36}
                            className="h-8 w-8 object-contain sm:h-9 sm:w-9"
                            priority
                        />
                        <span className="font-[family-name:var(--font-display)] text-xl font-normal sm:text-2xl">
                            É de Chão
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        <ul className="flex items-center space-x-6">
                            {menuItems.map((item) => (
                                <li key={item.title}>
                                    {item.submenu ? (
                                        <div className="group relative">
                                            <button
                                                className="py-2 text-[#FDE5B9] transition-colors hover:text-[#FFB902]"
                                                aria-expanded="false"
                                                aria-haspopup="true"
                                            >
                                                {item.title}
                                            </button>
                                            <ul
                                                className="absolute left-0 top-full hidden min-w-[200px] rounded-md bg-[#7E3117] py-2 shadow-lg group-hover:block"
                                                role="menu"
                                            >
                                                {item.submenu.map((subItem) => (
                                                    <li key={subItem.href} role="none">
                                                        <Link
                                                            href={subItem.href}
                                                            className="block px-4 py-2 text-[#FDE5B9] transition-colors hover:bg-[#511707]"
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
                                            className="text-[#FDE5B9] transition-colors hover:text-[#FFB902]"
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="border-l border-[#FDE5B9]/20 pl-6">
                            <StoreStatus />
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="flex items-center space-x-4 md:hidden">
                        <StoreStatus compact />

                        <Sheet>
                            <SheetTrigger
                                className="text-[#FDE5B9] hover:text-[#FFB902]"
                                aria-label="Abrir menu"
                            >
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            </SheetTrigger>
                            <SheetContent side="right" className="border-[#7E3117] bg-[#B43D16] p-0">
                                <header className="border-b border-[#7E3117] p-4">
                                    <SheetTitle className="font-[family-name:var(--font-display)] text-xl text-[#FDE5B9]">
                                        É de Chão - Menu
                                    </SheetTitle>
                                </header>
                                <nav className="flex-1 overflow-y-auto py-4" aria-label="Menu mobile">
                                    <ul>
                                        {menuItems.map((item) => (
                                            <li key={item.title} className="px-4">
                                                {item.submenu ? (
                                                    <div className="mb-4">
                                                        <h2 className="mb-2 font-semibold text-[#FDE5B9]">
                                                            {item.title}
                                                        </h2>
                                                        <ul className="space-y-2 pl-4">
                                                            {item.submenu.map((subItem) => (
                                                                <li key={subItem.href}>
                                                                    <Link
                                                                        href={subItem.href}
                                                                        className="block text-[#FDE5B9] transition-colors hover:text-[#FFB902]"
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
                                                        className="block py-2 text-[#FDE5B9] transition-colors hover:text-[#FFB902]"
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
            </div>
        </nav>
    )
}
