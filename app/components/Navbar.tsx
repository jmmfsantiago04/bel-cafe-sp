import Link from "next/link"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
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

const navItems = [
    { href: "/reservas", label: "Reservas" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/duvidas", label: "Dúvidas" },
    { href: "/blog", label: "Blog" },
]

export function Navbar() {
    return (
        <nav className="w-full border-b bg-[#8B4513] py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-[#F5DEB3] text-xl font-bold">
                    É de Chão
                </Link>

                <div className="flex items-center gap-6">
                    <DropdownMenu>
                        <DropdownMenuTrigger className="text-[#F5DEB3] bg-transparent hover:bg-[#654321] px-4 py-2 rounded-md transition-colors">
                            Menu
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#F5DEB3] border-none">
                            <div className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2">
                                {menuItems.map((item) => (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className="block rounded-md p-3 text-[#8B4513] hover:bg-[#DEB887] transition-colors"
                                    >
                                        <span className="text-sm font-medium">
                                            {item.title}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="flex items-center gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-[#F5DEB3] hover:bg-[#654321] px-4 py-2 rounded-md transition-colors"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
} 