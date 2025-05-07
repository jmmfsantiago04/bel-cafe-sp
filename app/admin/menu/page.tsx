'use client'

import { useState } from "react"
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
import { DrinkForm } from "@/components/menu/drink-form"

export default function MenuPage() {
    const [itemDialogOpen, setItemDialogOpen] = useState(false)
    const [drinkDialogOpen, setDrinkDialogOpen] = useState(false)

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold text-[#F5E6D3] font-serif">É de Chão</h1>
                    <p className="text-[#FFB800] italic">Comida de Afeto</p>
                    <div className="h-px bg-[#F5E6D3]/20 my-4" />
                    <h2 className="text-2xl font-semibold text-[#F5E6D3]">Gerenciar Cardápio</h2>
                    <p className="text-[#F5E6D3]/80">Adicione ou edite itens do cardápio</p>
                </div>

                <div className="flex gap-4">
                    <Dialog open={itemDialogOpen} onOpenChange={setItemDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#2D4F56] hover:bg-[#1D3F46] text-[#F5E6D3]">
                                Adicionar Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-[#8B2500] border-[#F5E6D3]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#F5E6D3]">Novo Item do Cardápio</DialogTitle>
                                <DialogDescription className="text-[#F5E6D3]/80">
                                    Preencha os detalhes do novo item do cardápio abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <AddMenuItemForm onSuccess={() => setItemDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>

                    <Dialog open={drinkDialogOpen} onOpenChange={setDrinkDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#E67E22] hover:bg-[#D35400] text-[#F5E6D3]">
                                Adicionar Bebida
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl bg-[#8B2500] border-[#F5E6D3]/20">
                            <DialogHeader>
                                <DialogTitle className="text-[#F5E6D3]">Nova Bebida</DialogTitle>
                                <DialogDescription className="text-[#F5E6D3]/80">
                                    Preencha os detalhes da nova bebida abaixo.
                                </DialogDescription>
                            </DialogHeader>
                            <DrinkForm onSuccess={() => setDrinkDialogOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Menu items list will be added here later */}
            </div>
        </div>
    )
} 