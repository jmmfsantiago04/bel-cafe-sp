'use client'

import { Button } from "@/components/ui/button"
import { MenuItemForm } from "@/components/admin/menu-form"
import { DrinkForm } from "@/components/menu/drink-form"
import { Coffee, Plus } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function MenuDialogs() {
    return (
        <div className="flex gap-3">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Item
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                            Novo Item do Cardápio
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <MenuItemForm />
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                        <Coffee className="w-4 h-4 mr-2" />
                        Adicionar Bebida
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                            Nova Bebida
                        </AlertDialogTitle>
                    </AlertDialogHeader>
                    <DrinkForm />
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
} 