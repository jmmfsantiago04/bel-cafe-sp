'use client'

import { Card } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Calendar as CalendarIcon, Clock, Mail, Phone, User, Users, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Suspense, useState, useMemo, useEffect } from "react"
import { updateReservationStatus, getAllReservations, deleteReservation } from "@/app/actions/reservations"
import { toast } from "sonner"
import { EditReservationForm } from "@/components/admin/edit-reservation-form"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR')
}

function formatTime(timeStr: string) {
    return timeStr
}

function getMealPeriodLabel(period: string) {
    const labels = {
        cafe: "Café da Manhã",
        almoco: "Almoço",
        jantar: "Jantar"
    }
    return labels[period as keyof typeof labels] || period
}

function getStatusLabel(status: string) {
    const labels = {
        pending: "Pendente",
        confirmed: "Confirmada",
        cancelled: "Cancelada"
    }
    return labels[status as keyof typeof labels] || status
}

function getStatusColor(status: string) {
    const colors = {
        pending: "bg-yellow-100 text-yellow-800",
        confirmed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800"
    }
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800"
}

type Reservation = {
    id: number
    name: string
    email: string
    phone: string
    date: string
    time: string
    guests: number
    mealPeriod: string
    status: string
}

interface ReservationsTableProps {
    reservations: Reservation[]
}

export function ReservationsTable({ reservations: initialReservations }: ReservationsTableProps) {
    const [selectedRows, setSelectedRows] = useState<number[]>([]);
    const [reservations, setReservations] = useState(initialReservations);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
    const [isFiltering, setIsFiltering] = useState(false);
    const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);

    // Filter reservations by selected date
    const filteredReservations = useMemo(() => {
        const dateString = format(selectedDate, 'yyyy-MM-dd');
        return reservations.filter(reservation => {
            const dateMatches = reservation.date === dateString;
            const periodMatches = selectedPeriods.length === 0 || selectedPeriods.includes(reservation.mealPeriod);
            return dateMatches && periodMatches;
        });
    }, [reservations, selectedDate, selectedPeriods]);

    // Reset selected rows when date changes
    useEffect(() => {
        setSelectedRows([]);
    }, [selectedDate]);

    // Handle select all checkbox
    const handleSelectAll = (checked: boolean | "indeterminate") => {
        if (checked === true) {
            setSelectedRows(reservations.map(r => r.id))
        } else {
            setSelectedRows([])
        }
    }

    // Handle individual row selection
    const handleSelectRow = (checked: boolean | "indeterminate", id: number) => {
        if (checked === true) {
            setSelectedRows([...selectedRows, id])
        } else {
            setSelectedRows(selectedRows.filter(rowId => rowId !== id))
        }
    }

    // Handle bulk delete
    const handleBulkDelete = async () => {
        try {
            // Delete each selected reservation
            for (const id of selectedRows) {
                const result = await deleteReservation(id);
                if ('error' in result) {
                    throw new Error(result.error);
                }
            }

            toast.success(`${selectedRows.length} reservas excluídas com sucesso!`);

            // Refresh the table
            const result = await getAllReservations();
            if (!('error' in result)) {
                setReservations(result.data);
            }

            // Clear selection
            setSelectedRows([]);
        } catch (error) {
            toast.error(
                "Erro ao excluir reservas",
                { description: error instanceof Error ? error.message : "Não foi possível excluir algumas reservas." }
            );
        }
    }

    async function handleStatusUpdate(id: number, newStatus: string) {
        try {
            setIsUpdating(id);
            const result = await updateReservationStatus(id, newStatus);

            if ('error' in result) {
                throw new Error(result.error);
            }

            // Update local state
            setReservations(prev => prev.map(res =>
                res.id === id ? { ...res, status: newStatus } : res
            ));

            toast.success("Status atualizado", {
                description: `Reserva ${newStatus === 'confirmed' ? 'confirmada' : newStatus === 'cancelled' ? 'cancelada' : 'pendente'} com sucesso.`,
            });
        } catch (error) {
            toast.error("Erro ao atualizar status", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            });
        } finally {
            setIsUpdating(null);
        }
    }

    const handleDateSelect = async (date: Date | undefined) => {
        if (!date) return;
        setIsFiltering(true);
        setSelectedDate(date);
        setSelectedRows([]); // Clear selection when date changes
        setIsFiltering(false);
    };

    const handlePeriodToggle = (period: string) => {
        setSelectedPeriods(prev => {
            if (prev.includes(period)) {
                return prev.filter(p => p !== period);
            } else {
                return [...prev, period];
            }
        });
    };

    return (
        <div className="mx-4 md:mx-6 lg:mx-8 my-6">
            {/* Date Selector */}
            <div className="mb-6 space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-[#8B4513]" />
                        <h3 className="text-lg font-medium text-[#8B4513]">Reservas do dia</h3>
                    </div>
                    <div className="flex-1 max-w-xs">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        "border-[#DEB887] hover:bg-[#FAEBD7] hover:text-[#8B4513]",
                                        "focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2",
                                        isFiltering && "opacity-70 cursor-not-allowed"
                                    )}
                                    disabled={isFiltering}
                                    aria-label="Selecionar data"
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 bg-white shadow-md"
                                align="start"
                            >
                                <div className="bg-white rounded-md border border-[#DEB887] p-3">
                                    <Calendar
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={handleDateSelect}
                                        initialFocus
                                        disabled={(date) =>
                                            date > new Date(new Date().setMonth(new Date().getMonth() + 3)) ||
                                            date < new Date(new Date().setMonth(new Date().getMonth() - 3))
                                        }
                                        className="bg-white"
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Add Period Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-[#8B4513]" />
                        <span className="text-sm font-medium text-[#8B4513]">Filtrar por período:</span>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="cafe"
                                checked={selectedPeriods.includes('cafe')}
                                onCheckedChange={() => handlePeriodToggle('cafe')}
                                className="border-[#DEB887] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                            />
                            <label
                                htmlFor="cafe"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#8B4513]"
                            >
                                Café da Manhã
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="almoco"
                                checked={selectedPeriods.includes('almoco')}
                                onCheckedChange={() => handlePeriodToggle('almoco')}
                                className="border-[#DEB887] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                            />
                            <label
                                htmlFor="almoco"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#8B4513]"
                            >
                                Almoço
                            </label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox
                                id="jantar"
                                checked={selectedPeriods.includes('jantar')}
                                onCheckedChange={() => handlePeriodToggle('jantar')}
                                className="border-[#DEB887] data-[state=checked]:bg-[#8B4513] data-[state=checked]:border-[#8B4513]"
                            />
                            <label
                                htmlFor="jantar"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer text-[#8B4513]"
                            >
                                Jantar
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <p className="text-sm text-[#D2691E]">
                        {isFiltering ? (
                            <span className="flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-[#D2691E] border-t-transparent rounded-full animate-spin" />
                                Filtrando reservas...
                            </span>
                        ) : (
                            <>
                                {filteredReservations.length} {filteredReservations.length === 1 ? 'reserva encontrada' : 'reservas encontradas'}
                                {selectedPeriods.length > 0 && (
                                    <span className="ml-2">
                                        para {selectedPeriods.map(p => getMealPeriodLabel(p)).join(', ')}
                                    </span>
                                )}
                            </>
                        )}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#8B4513] hover:text-[#654321] hover:bg-[#FAEBD7]"
                            onClick={() => handleDateSelect(new Date())}
                            disabled={isFiltering}
                        >
                            Hoje
                        </Button>
                        {selectedPeriods.length > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#8B4513] hover:text-[#654321] hover:bg-[#FAEBD7]"
                                onClick={() => setSelectedPeriods([])}
                                disabled={isFiltering}
                            >
                                Limpar Filtros
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            {/* Bulk Actions */}
            {selectedRows.length > 0 && (
                <div className="sticky top-4 z-50 mb-4">
                    <div className="bg-yellow-50/95 backdrop-blur-sm border border-yellow-200 rounded-lg p-4 shadow-lg">
                        <div className="flex items-center justify-between">
                            <p className="text-yellow-800 font-medium">
                                {selectedRows.length} {selectedRows.length === 1 ? 'reserva selecionada' : 'reservas selecionadas'}
                            </p>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm" className="bg-red-500 hover:bg-red-600">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Deletar Selecionados
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Deletar Reservas</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Tem certeza que deseja deletar {selectedRows.length} {selectedRows.length === 1 ? 'reserva' : 'reservas'}? Esta ação não pode ser desfeita.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleBulkDelete}>
                                            Deletar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="rounded-lg border border-[#DEB887] overflow-hidden bg-white">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-[#FAEBD7] border-b border-[#DEB887] sticky top-0 z-10">
                            <tr>
                                <th className="w-[40px] px-4 py-3">
                                    <Checkbox
                                        checked={
                                            selectedRows.length === filteredReservations.length && filteredReservations.length > 0
                                        }
                                        onCheckedChange={handleSelectAll}
                                    />
                                </th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Cliente</th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Data</th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Horário</th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Período</th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Pessoas</th>
                                <th className="text-left px-4 py-3 text-[#8B4513] font-serif font-semibold">Status</th>
                                <th className="text-right px-4 py-3 text-[#8B4513] font-serif font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#DEB887]">
                            {filteredReservations.map((reservation) => (
                                <tr key={reservation.id} className="hover:bg-[#FDF5E6] transition-colors">
                                    <td className="px-4 py-3">
                                        <Checkbox
                                            checked={selectedRows.includes(reservation.id)}
                                            onCheckedChange={(checked) => handleSelectRow(checked, reservation.id)}
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <div>
                                            <p className="font-medium text-[#8B4513]">{reservation.name}</p>
                                            <p className="text-sm text-[#D2691E]">{reservation.email}</p>
                                            <p className="text-sm text-[#D2691E]">{reservation.phone}</p>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">{formatDate(reservation.date)}</td>
                                    <td className="px-4 py-3 whitespace-nowrap">{formatTime(reservation.time)}</td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAEBD7] text-[#8B4513]">
                                            {getMealPeriodLabel(reservation.mealPeriod)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                                            {reservation.guests} {reservation.guests === 1 ? 'pessoa' : 'pessoas'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className={`w-[120px] justify-start font-medium ${getStatusColor(reservation.status)}`}
                                                >
                                                    {getStatusLabel(reservation.status)}
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(reservation.id, 'pending')}
                                                    className="text-yellow-600"
                                                >
                                                    Pendente
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                                    className="text-green-600"
                                                >
                                                    Confirmada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                                    className="text-red-600"
                                                >
                                                    Cancelada
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(reservation.id, 'completed')}
                                                    className="text-blue-600"
                                                >
                                                    Concluída
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleStatusUpdate(reservation.id, 'no_show')}
                                                    className="text-gray-600"
                                                >
                                                    Não Compareceu
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-[#8B4513] hover:text-[#654321]"
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Editar Reserva</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <EditReservationForm
                                                        reservation={reservation}
                                                        onSuccess={() => {
                                                            // Refresh reservations after edit
                                                            window.location.reload();
                                                        }}
                                                    />
                                                </AlertDialogContent>
                                            </AlertDialog>

                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Deletar Reserva</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            Tem certeza que deseja deletar a reserva de {reservation.name}? Esta ação não pode ser desfeita.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={async () => {
                                                                const result = await deleteReservation(reservation.id);
                                                                if (!('error' in result)) {
                                                                    toast.success("Reserva deletada com sucesso");
                                                                    setReservations(reservations.filter(r => r.id !== reservation.id));
                                                                } else {
                                                                    toast.error("Erro ao deletar reserva");
                                                                }
                                                            }}
                                                        >
                                                            Deletar
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredReservations.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <CalendarIcon className="w-12 h-12 text-[#DEB887]" />
                                            <h3 className="text-lg font-medium text-[#8B4513]">
                                                Nenhuma reserva encontrada para esta data
                                            </h3>
                                            <p className="text-[#D2691E] text-sm">
                                                Selecione outra data ou aguarde novas reservas.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
} 