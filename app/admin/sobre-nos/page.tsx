'use client'

import { useCallback, useEffect, useState } from "react"
import { AboutContentForm } from "./components/about-content-form"
import { AboutContentTable } from "./components/about-content-table"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { createAboutContent, deleteAboutContent, getAllAboutContent, updateAboutContent } from "@/app/actions/about"
import { type AboutContentFormData, type AboutContentResponse } from "@/app/types/about"
import { toast } from "sonner"

export default function AboutContentPage() {
    const [content, setContent] = useState<AboutContentResponse[]>([])
    const [selectedContent, setSelectedContent] = useState<AboutContentResponse | null>(null)
    const [isFormVisible, setIsFormVisible] = useState(false)

    const fetchContent = useCallback(async () => {
        try {
            const response = await getAllAboutContent()
            if ('error' in response) {
                throw new Error(response.error)
            }
            setContent(response.data.map(item => ({
                ...item,
                section: item.section as "story" | "team" | "contact"
            })))
        } catch (error) {
            console.error('Error fetching content:', error)
            toast.error('Erro ao carregar o conteúdo')
        }
    }, [])

    useEffect(() => {
        fetchContent()
    }, [fetchContent])

    const handleSubmit = async (values: AboutContentFormData) => {
        try {
            if (selectedContent) {
                await updateAboutContent(selectedContent.id, values)
                toast.success('Conteúdo atualizado com sucesso')
            } else {
                await createAboutContent(values)
                toast.success('Conteúdo criado com sucesso')
            }
            setSelectedContent(null)
            setIsFormVisible(false)
            fetchContent()
        } catch (error) {
            console.error('Error submitting content:', error)
            toast.error('Erro ao salvar o conteúdo')
        }
    }

    const handleEdit = (content: AboutContentResponse) => {
        setSelectedContent(content)
        setIsFormVisible(true)
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Tem certeza que deseja excluir este conteúdo?')) return

        try {
            await deleteAboutContent(id)
            toast.success('Conteúdo excluído com sucesso')
            fetchContent()
        } catch (error) {
            console.error('Error deleting content:', error)
            toast.error('Erro ao excluir o conteúdo')
        }
    }

    const handleCancel = () => {
        setSelectedContent(null)
        setIsFormVisible(false)
    }

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl font-bold">
                    Gerenciar Conteúdo do Sobre Nós
                </h1>
                <Button
                    onClick={() => setIsFormVisible(true)}
                    className="bg-[#8B4513] hover:bg-[#4A2512]"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="text-sm sm:text-base">Novo Conteúdo</span>
                </Button>
            </div>

            {isFormVisible ? (
                <Card className="p-4 sm:p-6">
                    <AboutContentForm
                        selectedContent={selectedContent}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </Card>
            ) : (
                <AboutContentTable
                    content={content}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
} 