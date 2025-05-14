'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, Pencil } from "lucide-react"
import { BusinessHoursForm } from "./business-hours-form"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { BusinessHoursFormData } from "@/app/actions/business-hours"
import { useState } from "react"

const periodLabels: Record<BusinessHoursFormData['period'], string> = {
    geral: "Horário Geral",
    cafe: "Café da Manhã",
    almoco: "Almoço",
    jantar: "Jantar"
}

interface BusinessHoursTableProps {
    initialHours: BusinessHoursFormData[]
}

export function BusinessHoursTable({ initialHours }: BusinessHoursTableProps) {
    const [hours, setHours] = useState<BusinessHoursFormData[]>(initialHours)

    // Ordem definida dos períodos
    const periodOrder = {
        geral: 0,
        cafe: 1,
        almoco: 2,
        jantar: 3
    }

    // Ordenar para que o horário geral apareça primeiro, seguido pela ordem definida
    const sortedHours = [...hours].sort((a, b) => {
        return periodOrder[a.period] - periodOrder[b.period]
    })

    return (
        <div className="rounded-md border border-[#DEB887]">
            <Table>
                <TableHeader className="bg-[#FDF5E6]">
                    <TableRow>
                        <TableHead className="text-[#8B4513]">Período</TableHead>
                        <TableHead className="text-[#8B4513]">Dias da Semana</TableHead>
                        <TableHead className="text-[#8B4513]">Horário</TableHead>
                        <TableHead className="text-[#8B4513]">Status</TableHead>
                        <TableHead className="text-[#8B4513]">Ações</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedHours.map((hour) => (
                        <TableRow
                            key={hour.id}
                            className={hour.period === 'geral' ? 'bg-[#FDF5E6]/50' : ''}
                        >
                            <TableCell className="font-medium text-[#4A2512]">
                                {periodLabels[hour.period]}
                            </TableCell>
                            <TableCell className="text-[#8B4513]">{hour.weekdays}</TableCell>
                            <TableCell className="text-[#8B4513]">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {hour.openTime} - {hour.closeTime}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={hour.isActive ? "default" : "secondary"}
                                    className={hour.isActive
                                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                                        : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                                    }
                                >
                                    {hour.isActive ? "Ativo" : "Inativo"}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-[#8B4513] border-[#DEB887] hover:bg-[#DEB887]/20"
                                        >
                                            <Pencil className="h-4 w-4 mr-2" />
                                            Editar
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-2xl">
                                        <DialogTitle>Editar Horário de Funcionamento</DialogTitle>
                                        <BusinessHoursForm
                                            initialData={hour}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </TableCell>
                        </TableRow>
                    ))}
                    {hours.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-[#8B4513]/80 py-6">
                                Nenhum horário cadastrado
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
} 