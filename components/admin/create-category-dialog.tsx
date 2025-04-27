'use client'

import { Button } from "@/components/ui/button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"
import { CategoriesForm } from "./categories-form"
import { useState } from "react"

export function CreateCategoryDialog() {
    const [open, setOpen] = useState(false)

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                    Nova Categoria
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <AlertDialogHeader>
                    <AlertDialogTitle>Nova Categoria</AlertDialogTitle>
                    <AlertDialogDescription>
                        Crie uma nova categoria para organizar os itens do cardápio
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <CategoriesForm onSuccess={() => setOpen(false)} />
            </AlertDialogContent>
        </AlertDialog>
    )
} 