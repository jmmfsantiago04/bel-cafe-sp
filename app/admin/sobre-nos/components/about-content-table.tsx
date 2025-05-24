'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pencil, Trash2 } from "lucide-react"
import { type AboutContentResponse } from "@/app/types/about"

interface AboutContentTableProps {
    content: AboutContentResponse[]
    onEdit: (content: AboutContentResponse) => void
    onDelete: (id: number) => void
}

const sectionLabels = {
    story: "História",
    team: "Equipe",
    contact: "Contato"
}

export function AboutContentTable({ content, onEdit, onDelete }: AboutContentTableProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Conteúdo do Sobre Nós</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs sm:text-sm">Seção</TableHead>
                                <TableHead className="text-xs sm:text-sm">Título</TableHead>
                                <TableHead className="text-xs sm:text-sm">Ordem</TableHead>
                                <TableHead className="text-xs sm:text-sm">Status</TableHead>
                                <TableHead className="text-xs sm:text-sm">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {content.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={5}
                                        className="h-24 text-center text-sm sm:text-base"
                                    >
                                        Nenhum conteúdo encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                content.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="text-xs sm:text-sm">
                                            {sectionLabels[item.section]}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.title}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.displayOrder}
                                        </TableCell>
                                        <TableCell className="text-xs sm:text-sm">
                                            {item.isActive ? (
                                                <span className="text-green-600">Ativo</span>
                                            ) : (
                                                <span className="text-red-600">Inativo</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    onClick={() => onEdit(item)}
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={() => onDelete(item.id)}
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    )
} 