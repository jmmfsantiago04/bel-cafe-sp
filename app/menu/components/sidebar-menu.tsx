'use client'

import { useEffect, useMemo, useState } from "react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Coffee,
    UtensilsCrossed,
    Utensils,
    Beer,
    Sandwich,
    ChefHat,
    IceCream,
    Candy,
    type LucideIcon,
} from "lucide-react"
import { useMenuCategories, type MenuCategory } from "../../admin/categories/components/menu-categories-context"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const categoryIcons: Record<string, LucideIcon> = {
    isCafeDaManha: Coffee,
    isAlmoco: UtensilsCrossed,
    isJantar: Utensils,
    isBebidasQuentes: Coffee,
    isHotDrink: Coffee,
    isBebidasFrias: Beer,
    isColdDrink: Beer,
    isSalgado: Sandwich,
    isDoce: Candy,
    isSobremesa: IceCream,
}

type GroupId = "refeicoes" | "lanches" | "bebidas"

const GROUPS: {
    id: GroupId
    label: string
    flags: string[]
    slugs: string[]
}[] = [
    {
        id: "refeicoes",
        label: "Refeições",
        flags: ["isCafeDaManha", "isAlmoco", "isJantar"],
        slugs: ["cafe-manha", "almoco", "jantar"],
    },
    {
        id: "lanches",
        label: "Lanches & Doces",
        flags: ["isSalgado", "isDoce", "isSobremesa"],
        slugs: ["salgados", "doces", "sobremesas"],
    },
    {
        id: "bebidas",
        label: "Bebidas",
        flags: ["isBebidasQuentes", "isHotDrink", "isBebidasFrias", "isColdDrink"],
        slugs: ["bebidas-quentes", "bebidas-frias"],
    },
]

function matchGroup(category: MenuCategory, group: (typeof GROUPS)[number]) {
    return group.flags.includes(category.flag) || group.slugs.includes(category.slug)
}

export function SidebarMenu() {
    const pathname = usePathname()
    const { categories } = useMenuCategories()

    const activeCategories = useMemo(
        () =>
            categories
                .filter((cat) => cat.isActive)
                .slice()
                .sort((a, b) => a.displayOrder - b.displayOrder),
        [categories],
    )

    const grouped = useMemo(
        () =>
            GROUPS.map((group) => ({
                ...group,
                items: activeCategories.filter((cat) => matchGroup(cat, group)),
            })).filter((group) => group.items.length > 0),
        [activeCategories],
    )

    const ungrouped = useMemo(
        () =>
            activeCategories.filter(
                (cat) => !GROUPS.some((group) => matchGroup(cat, group)),
            ),
        [activeCategories],
    )

    const openGroupIds = useMemo(() => {
        if (grouped.length === 0) return [] as string[]
        const fromPath = grouped
            .filter((group) =>
                group.items.some((cat) => pathname === `/menu/${cat.slug}`),
            )
            .map((group) => group.id)
        return fromPath.length > 0 ? fromPath : [grouped[0].id]
    }, [grouped, pathname])

    const [openGroups, setOpenGroups] = useState<string[]>([])

    useEffect(() => {
        setOpenGroups((prev) => {
            if (
                prev.length === openGroupIds.length &&
                prev.every((id, index) => id === openGroupIds[index])
            ) {
                return prev
            }
            return openGroupIds
        })
    }, [openGroupIds])

    return (
        <div className="flex h-full w-full flex-col border-r border-[#B43D16]/15 bg-[#FFF8EC]/95 shadow-xl backdrop-blur-sm">
            <div className="rounded-b-3xl bg-gradient-to-r from-[#511707] to-[#7E3117] p-6 text-[#FDE5B9] shadow-lg sm:p-8">
                <Link href="/menu" className="group block">
                    <h2 className="text-center font-[family-name:var(--font-display)] text-2xl font-bold transition-colors group-hover:text-[#FFB902] sm:text-3xl">
                        É de Chão
                    </h2>
                    <div className="mt-2 flex items-center justify-center space-x-2 sm:mt-3">
                        <span
                            className="text-xl transition-transform group-hover:scale-110 sm:text-2xl"
                            aria-hidden="true"
                        >
                            ☕
                        </span>
                        <p className="text-xs font-medium text-[#FFB902] sm:text-sm">
                            Comida de Afeto
                        </p>
                    </div>
                </Link>
            </div>

            <div className="mt-4 px-4 font-[family-name:var(--font-display)] text-sm font-medium text-[#511707] sm:mt-6 sm:text-base">
                Cardápio
            </div>

            <nav className="flex-1 overflow-y-auto px-3 py-2 sm:px-4 sm:py-3" aria-label="Categorias do cardápio">
                {activeCategories.length === 0 ? (
                    <p className="px-2 py-4 text-xs text-[#7E3117]/70 sm:text-sm">
                        Carregando categorias…
                    </p>
                ) : (
                    <Accordion
                        type="multiple"
                        value={openGroups}
                        onValueChange={setOpenGroups}
                        className="w-full border-none"
                    >
                        {grouped.map((group) => (
                            <AccordionItem
                                key={group.id}
                                value={group.id}
                                className="mb-1 border-none"
                            >
                                <AccordionTrigger className="rounded-xl px-3 py-2.5 text-[#511707] hover:bg-[#FDE5B9]/70 hover:no-underline sm:px-4 [&[data-state=open]]:bg-[#FDE5B9]/50">
                                    <span className="font-[family-name:var(--font-display)] text-sm sm:text-base">
                                        {group.label}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pb-2 pt-1">
                                    <ul className="space-y-1">
                                        {group.items.map((category) => {
                                            const Icon =
                                                categoryIcons[category.flag] || ChefHat
                                            const isActive =
                                                pathname === `/menu/${category.slug}`

                                            return (
                                                <li key={category.id ?? category.slug}>
                                                    <Link
                                                        href={`/menu/${category.slug}`}
                                                        className={cn(
                                                            "flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 sm:gap-3 sm:px-4 sm:text-sm",
                                                            isActive
                                                                ? "bg-gradient-to-r from-[#B43D16] to-[#EE8614] text-[#FDE5B9] shadow-md"
                                                                : "text-[#7E3117] hover:bg-[#FFB902]/20 hover:text-[#511707]",
                                                        )}
                                                    >
                                                        <Icon
                                                            className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                                                            aria-hidden="true"
                                                        />
                                                        {category.name}
                                                    </Link>
                                                </li>
                                            )
                                        })}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}

                {ungrouped.length > 0 ? (
                    <ul className="mt-2 space-y-1 border-t border-[#B43D16]/10 pt-2">
                        {ungrouped.map((category) => {
                            const Icon = categoryIcons[category.flag] || ChefHat
                            const isActive = pathname === `/menu/${category.slug}`
                            return (
                                <li key={category.id ?? category.slug}>
                                    <Link
                                        href={`/menu/${category.slug}`}
                                        className={cn(
                                            "flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all duration-200 sm:gap-3 sm:px-4 sm:text-sm",
                                            isActive
                                                ? "bg-gradient-to-r from-[#B43D16] to-[#EE8614] text-[#FDE5B9] shadow-md"
                                                : "text-[#7E3117] hover:bg-[#FFB902]/20 hover:text-[#511707]",
                                        )}
                                    >
                                        <Icon
                                            className="h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                                            aria-hidden="true"
                                        />
                                        {category.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                ) : null}
            </nav>
        </div>
    )
}
