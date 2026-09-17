import { db } from "@/lib/db"
import { MenuAdminClient, type AdminMenuItem } from "@/app/admin/menu/components/menu-admin-client"

function toNumber(value: string | number | null | undefined): number | null {
    if (value === null || value === undefined || value === "") return null
    const n = typeof value === "number" ? value : Number(value)
    return Number.isFinite(n) ? n : null
}

export default async function MenuPage() {
    const [menuItemsData, drinksData] = await Promise.all([
        db.query.menuItems.findMany(),
        db.query.drinks.findMany(),
    ])

    const formattedDrinks: AdminMenuItem[] = drinksData.map((drink) => ({
        kind: "drink" as const,
        id: drink.id,
        name: drink.name,
        description: drink.description,
        price: toNumber(drink.price) ?? 0,
        imageUrl: drink.imageUrl,
        isAvailable: drink.isAvailable,
        isPopular: drink.isPopular,
        isHotDrink: drink.isHotDrink,
        isColdDrink: !drink.isHotDrink,
        isAlcoholic: drink.isAlcoholic,
        hasSize: drink.hasSize,
        mediumSizePrice: toNumber(drink.mediumSizePrice),
        largeSizePrice: toNumber(drink.largeSizePrice),
        isGlutenFree: drink.isGlutenFree,
        isVegetarian: drink.isVegetarian,
        isVegan: drink.isVegan,
        isSalgado: false,
        isDoce: false,
        isCafeDaManha: false,
        isAlmoco: false,
        isJantar: false,
        isSobremesa: false,
    }))

    const formattedMenuItems: AdminMenuItem[] = menuItemsData.map((item) => ({
        kind: "menu" as const,
        id: item.id,
        name: item.name,
        description: item.description,
        price: toNumber(item.price) ?? 0,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        isPopular: item.isPopular,
        isSalgado: item.isSalgado,
        isDoce: item.isDoce,
        isCafeDaManha: item.isCafeDaManha,
        isAlmoco: item.isAlmoco,
        isJantar: item.isJantar,
        isSobremesa: item.isSobremesa,
        isSugarFree: item.isSugarFree,
        hasSize: item.hasSize,
        mediumSizePrice: toNumber(item.mediumSizePrice),
        largeSizePrice: toNumber(item.largeSizePrice),
        isGlutenFree: item.isGlutenFree,
        isVegetarian: item.isVegetarian,
        isVegan: item.isVegan,
    }))

    const items = [...formattedMenuItems, ...formattedDrinks]

    return <MenuAdminClient items={items} />
}