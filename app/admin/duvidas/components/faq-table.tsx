'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { type FaqResponse } from "@/app/types/faqs"
import { Plus, Pencil, Trash2 } from "lucide-react"

interface FaqTableProps {
    faqs: FaqResponse[]
    onAdd: () => void
    onEdit: (faq: FaqResponse) => void
    onToggle: (faq: FaqResponse) => void
    onDelete: (id: number) => void
}

const categoryLabels: Record<FaqResponse['category'], string> = {
    common: "Perguntas Comuns",
    services: "Serviços & Facilidades",
    other: "Outras"
}

export function FaqTable({ faqs, onAdd, onEdit, onToggle, onDelete }: FaqTableProps) {
    return (
        <Card className="w-full overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl sm:text-2xl">Perguntas Frequentes</CardTitle>
                        <CardDescription className="text-sm sm:text-base">
                            Gerencie as perguntas frequentes do site
                        </CardDescription>
                    </div>
                    <Button onClick={onAdd} className="bg-[#8B4513] hover:bg-[#4A2512] text-sm sm:text-base whitespace-nowrap">
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Pergunta
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Pergunta</TableHead>
                                <TableHead className="text-xs sm:text-sm">Categoria</TableHead>
                                <TableHead className="text-xs sm:text-sm">Ordem</TableHead>
                                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="text-right text-xs sm:text-sm">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {faqs.map((faq) => (
                                <TableRow key={faq.id}>
                                    <TableCell className="font-medium max-w-[200px] sm:max-w-md truncate text-xs sm:text-sm">
                                        {faq.question}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm whitespace-nowrap">
                                        {categoryLabels[faq.category]}
                                    </TableCell>
                                    <TableCell className="text-xs sm:text-sm">{faq.displayOrder}</TableCell>
                                    <TableCell>
                                        <Switch
                                            checked={faq.isActive}
                                            onCheckedChange={() => onToggle(faq)}
                                            aria-label={`${faq.isActive ? "Desativar" : "Ativar"} pergunta ${faq.question}`}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right space-x-1 sm:space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(faq)}
                                            className="hover:text-[#8B4513] h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                            <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="sr-only">Editar {faq.question}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(faq.id)}
                                            className="hover:text-red-500 h-8 w-8 sm:h-9 sm:w-9"
                                        >
                                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                            <span className="sr-only">Excluir {faq.question}</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {faqs.length === 0 && (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="text-center py-4 sm:py-6 text-muted-foreground text-sm sm:text-base"
                                    >
                                        Nenhuma pergunta encontrada
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
} 