'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AddMenuItemForm } from "@/components/admin/add-menu-item-form"
import { DrinkForm } from "@/components/admin/drink-form"
import { EditMenuItemForm } from "@/components/admin/edit-menu-item-form"
import { EditDrinkForm } from "@/components/admin/edit-drink-form"
import { Plus } from "lucide-react"
import { MenuItemsTable, type MenuItem } from "../../../components/admin/menu-items-table"
import { toast } from "sonner"
import { deleteDrink, updateDrink } from "@/app/actions/drinks"
import { deleteMenuItem, updateMenuItem } from "@/app/actions/menu"
import { db } from "@/lib/db"
import { menuItems, drinks } from "@/db/schema"

export default async function MenuPage() {
    // Fetch menu items and drinks directly from the database
    const [menuItemsData, drinksData] = await Promise.all([
        db.query.menuItems.findMany(),
        db.query.drinks.findMany()
    ])

    // Transform drinks to match menu item format
    const formattedDrinks = drinksData.map(drink => ({
        id: drink.id,
        name: drink.name,
        description: drink.description,
        price: drink.price,
        imageUrl: drink.imageUrl,
        isAvailable: drink.isAvailable,
        isPopular: drink.isPopular,
        isHotDrink: drink.isHotDrink,
        isColdDrink: !drink.isHotDrink,
        // Additional menu item fields set to false for drinks
        isSalgado: false,
        isDoce: false,
        isCafeDaManha: false,
        isAlmoco: false,
        isJantar: false,
        isSobremesa: false,
    }))

    // Transform menu items to ensure all fields are present
    const formattedMenuItems = menuItemsData.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        imageUrl: item.imageUrl,
        isAvailable: item.isAvailable,
        isPopular: item.isPopular,
        isSalgado: item.isSalgado,
        isDoce: item.isDoce,
        isCafeDaManha: item.isCafeDaManha,
        isAlmoco: item.isAlmoco,
        isJantar: item.isJantar,
        isSobremesa: item.isSobremesa,
    }))

    // Combine all items
    const items = [...formattedMenuItems, ...formattedDrinks]

    return (
        <div className="h-[calc(100vh-4rem)] p-6 flex flex-col bg-[#FDF5E6]/30">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-[#8B4513] font-serif">Cardápio</h1>
                    <p className="text-[#D2691E] text-sm mt-1">Gerencie os itens do cardápio</p>
                </div>

                <div className="flex gap-3">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Novo Item do Cardápio</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes do novo item do cardápio abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <AddMenuItemForm />
                        </DialogContent>
                    </Dialog>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white shadow-sm">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Bebida
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-white border-[#D2691E]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#8B4513]">Nova Bebida</DialogTitle>
                                <DialogDescription className="text-[#D2691E]">
                                    Preencha os detalhes da nova bebida abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <DrinkForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <MenuItemsTable
                    items={items}
                    onEdit={(item) => {
                        // Handle edit in client component
                    }}
                    onDelete={(item) => {
                        // Handle delete in client component
                    }}
                />
            </div>
        </div>
    )
} 