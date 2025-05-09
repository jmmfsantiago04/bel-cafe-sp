'use client'

import { useState } from "react"
import { toast } from "sonner"
import { removeDiscount } from "@/app/actions/discounts"
import { useRouter } from "next/navigation"

interface DiscountItemProps {
    id: number
    name: string
    discount: string
    type: "menu" | "drink"
}

export function DiscountItem({ id, name, discount, type }: DiscountItemProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleRemove = async () => {
        try {
            setIsLoading(true)
            const result = await removeDiscount(type, id)

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Desconto removido com sucesso!")
            router.refresh()
        } catch (error) {
            console.error("Error removing discount:", error)
            toast.error(error instanceof Error ? error.message : "Erro ao remover desconto")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="p-3 bg-[#FFF8F0] rounded-lg border border-[#DEB887]">
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium text-[#4A2512]">{name}</p>
                    <p className="text-sm text-[#8B4513]/80">
                        Desconto: {discount}%
                    </p>
                </div>
                <button
                    onClick={handleRemove}
                    disabled={isLoading}
                    className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                    {isLoading ? "Removendo..." : "Remover"}
                </button>
            </div>
        </div>
    )
} 