import Link from "next/link"
import { useState } from "react"
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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

const navigationItems = [
    { title: "Reservas", href: "/reservas" },
    { title: "Sobre Nós", href: "/sobre" },
    { title: "Dúvidas", href: "/duvidas" },
    { title: "Blog", href: "/blog" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="w-full border-b bg-[#8B4513] py-4">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="text-[#F5DEB3] text-xl font-bold">
                    É de Chão
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:block">
                    <NavigationMenu>
                        <NavigationMenuList className="gap-6">
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="text-[#F5DEB3] bg-transparent hover:bg-[#654321]">
                                    Menu
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                                        {menuItems.map((item) => (
                                            <ListItem
                                                key={item.title}
                                                title={item.title}
                                                href={item.href}
                                            />
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <Link href={item.href} legacyBehavior passHref>
                                        <NavigationMenuLink className={cn(navigationMenuTriggerStyle(), "text-[#F5DEB3] bg-transparent hover:bg-[#654321]")}>
                                            {item.title}
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Mobile Navigation */}
                <div className="lg:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" className="text-[#F5DEB3] hover:bg-[#654321] p-2">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="bg-[#8B4513] border-[#654321] w-[300px]">
                            <div className="flex flex-col gap-4 mt-8">
                                <div className="space-y-4 mb-6">
                                    <h3 className="text-[#F5DEB3] font-bold mb-2">Menu</h3>
                                    {menuItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block text-[#F5DEB3] hover:text-[#DEB887] py-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    {navigationItems.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className="block text-[#F5DEB3] hover:text-[#DEB887] py-2"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    )
}

const ListItem = ({ title, href }: { title: string; href: string }) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link
                    href={href}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-[#DEB887] hover:text-[#8B4513]",
                        "text-[#8B4513] bg-[#F5DEB3]"
                    )}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                </Link>
            </NavigationMenuLink>
        </li>
    )
} 