'use client'

import { useState, useEffect } from "react"
import { FaqForm } from "./components/faq-form"
import { FaqTable } from "./components/faq-table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getAllFaqs, createFaq, updateFaq, deleteFaq } from "@/app/actions/faqs"
import { type FaqFormData, type FaqResponse } from "@/app/types/faqs"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function AdminFaqPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [selectedFaq, setSelectedFaq] = useState<FaqResponse | null>(null)
    const [faqs, setFaqs] = useState<FaqResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    async function loadFaqs() {
        try {
            setIsLoading(true)
            setError(null)
            const result = await getAllFaqs()

            if ('error' in result) {
                throw new Error(result.error)
            }

            const typedFaqs = result.data?.map(faq => ({
                ...faq,
                category: faq.category as "common" | "services" | "other"
            })) || []

            setFaqs(typedFaqs)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar perguntas')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadFaqs()
    }, [])

    async function handleSubmit(values: FaqFormData) {
        try {
            if (selectedFaq) {
                const result = await updateFaq(selectedFaq.id, values)
                if ('error' in result) {
                    throw new Error(result.error)
                }
                toast.success("Pergunta atualizada com sucesso!")
            } else {
                const result = await createFaq(values)
                if ('error' in result) {
                    throw new Error(result.error)
                }
                toast.success("Pergunta criada com sucesso!")
            }
            setIsDialogOpen(false)
            loadFaqs()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao salvar pergunta")
        }
    }

    async function handleDelete(id: number) {
        try {
            const result = await deleteFaq(id)
            if ('error' in result) {
                throw new Error(result.error)
            }
            toast.success("Pergunta excluída com sucesso!")
            loadFaqs()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao excluir pergunta")
        }
    }

    function handleAdd() {
        setSelectedFaq(null)
        setIsDialogOpen(true)
    }

    function handleEdit(faq: FaqResponse) {
        setSelectedFaq(faq)
        setIsDialogOpen(true)
    }

    async function handleToggle(faq: FaqResponse) {
        try {
            const updatedFaq = { ...faq, isActive: !faq.isActive }
            const result = await updateFaq(faq.id, updatedFaq)
            if ('error' in result) {
                throw new Error(result.error)
            }
            toast.success("Status da pergunta atualizado com sucesso!")
            loadFaqs()
        } catch (error) {
            console.error(error)
            toast.error("Erro ao atualizar status da pergunta")
        }
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#2B4C5C]">Gerenciar Perguntas Frequentes</h1>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#8B4513] hover:bg-[#4A2512] text-sm sm:text-base whitespace-nowrap">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Pergunta
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-h-[80vh] w-[95vw] sm:w-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                {selectedFaq ? "Editar Pergunta" : "Nova Pergunta"}
                            </DialogTitle>
                        </DialogHeader>
                        <FaqForm
                            selectedFaq={selectedFaq}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsDialogOpen(false)}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center space-y-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B4513] mx-auto"></div>
                        <p className="text-[#2B4C5C] text-sm sm:text-base">Carregando perguntas...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div className="text-center text-red-500 space-y-2">
                        <p className="text-sm sm:text-base">Erro ao carregar perguntas:</p>
                        <p className="font-medium text-xs sm:text-sm">{error}</p>
                    </div>
                </div>
            ) : (
                <FaqTable
                    faqs={faqs}
                    onAdd={handleAdd}
                    onEdit={handleEdit}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                />
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:max-h-[80vh] w-[95vw] sm:w-auto">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">
                            Editar Pergunta
                        </DialogTitle>
                    </DialogHeader>
                    {selectedFaq && (
                        <FaqForm
                            selectedFaq={selectedFaq}
                            onSubmit={handleSubmit}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
} 