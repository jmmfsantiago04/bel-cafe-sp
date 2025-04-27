'use client'

import { Button } from "@/components/ui/button"
import { deleteMenuItem } from "@/app/actions/menu"
import { useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface DeleteMenuItemProps {
    id: number
    name: string
}

export function DeleteMenuItem({ id, name }: DeleteMenuItemProps) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    async function handleDelete() {
        startTransition(async () => {
            try {
                const result = await deleteMenuItem(id)
                if (result.error) {
                    throw new Error(result.error)
                }
                toast.success("Sucesso", {
                    description: `Item "${name}" excluído com sucesso`,
                })
                router.refresh()
            } catch (error) {
                toast.error("Erro", {
                    description: error instanceof Error ? error.message : "Erro ao excluir item",
                })
            }
        })
    }

    return (
        <Button
            variant="outline"
            size="sm"
            className="border-red-200 text-red-600 hover:bg-red-50"
            onClick={handleDelete}
            disabled={isPending}
        >
            {isPending ? (
                <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Excluindo...
                </div>
            ) : (
                "Excluir"
            )}
        </Button>
    )
} 