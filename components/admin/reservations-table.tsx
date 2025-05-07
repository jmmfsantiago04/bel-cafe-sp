'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Calendar as CalendarIcon, Clock, Pencil, Trash2, Plus, Settings2 } from "lucide-react"
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
import { updateReservationStatus, getAllReservations, deleteReservation, getReservationCount } from "@/app/actions/reservations"
import { toast } from "sonner"
import { EditReservationForm } from "@/components/admin/edit-reservation-form"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { AddReservationForm } from "@/components/admin/add-reservation-form"
import { Input } from "@/components/ui/input"
import { updateCapacity, getCapacity } from "@/app/actions/capacity"

function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T12:00:00');
    return format(date, 'dd/MM/yyyy', { locale: ptBR });
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
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isCapacityDialogOpen, setIsCapacityDialogOpen] = useState(false);
    const [periodCounts, setPeriodCounts] = useState({
        cafe: 0,
        almoco: 0,
        jantar: 0
    });
    const [capacityValues, setCapacityValues] = useState({
        cafe: 30,
        almoco: 30,
        jantar: 30
    });

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

    // Load capacity values when date changes
    const loadCapacityValues = async (date: Date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        const result = await getCapacity(formattedDate);
        if (!('error' in result)) {
            setCapacityValues({
                cafe: result.cafe,
                almoco: result.almoco,
                jantar: result.jantar
            });
        }
    };

    // Update useEffect to load capacity values when date changes
    useEffect(() => {
        loadCapacityValues(selectedDate);
        updatePeriodCounts(selectedDate);
    }, [selectedDate]);

    // Update handleDateSelect to also load capacity values
    const handleDateSelect = async (date: Date | undefined) => {
        if (!date) return;
        setIsFiltering(true);
        setSelectedDate(date);
        await loadCapacityValues(date);
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

    const refreshReservations = async () => {
        try {
            const result = await getAllReservations();
            if (!('error' in result)) {
                setReservations(result.data);
            }
        } catch (error) {
            toast.error("Erro ao atualizar lista de reservas");
        }
    };

    const handleAddSuccess = async () => {
        await refreshReservations();
        await updatePeriodCounts(selectedDate);
        setIsAddDialogOpen(false);
    };

    // Função para atualizar os contadores de cada período
    const updatePeriodCounts = async (date: Date) => {
        const formattedDate = format(date, "yyyy-MM-dd");
        try {
            const [cafeCount, almocoCount, jantarCount] = await Promise.all([
                getReservationCount(formattedDate, "cafe"),
                getReservationCount(formattedDate, "almoco"),
                getReservationCount(formattedDate, "jantar")
            ]);

            setPeriodCounts({
                cafe: 'error' in cafeCount ? 0 : cafeCount.totalGuests || 0,
                almoco: 'error' in almocoCount ? 0 : almocoCount.totalGuests || 0,
                jantar: 'error' in jantarCount ? 0 : jantarCount.totalGuests || 0
            });
        } catch (error) {
            console.error("Erro ao buscar contagem de reservas:", error);
        }
    };

    const handleCapacityChange = (period: keyof typeof capacityValues, value: number) => {
        setCapacityValues(prev => ({
            ...prev,
            [period]: value
        }));
    };

    const handleCapacitySubmit = async () => {
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const result = await updateCapacity({
                date: formattedDate,
                ...capacityValues
            });

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Capacidade atualizada com sucesso!", {
                description: "As alterações foram salvas.",
            });

            // Reload capacity values and counts
            await loadCapacityValues(selectedDate);
            updatePeriodCounts(selectedDate);
            setIsCapacityDialogOpen(false);
        } catch (error) {
            toast.error("Erro ao atualizar capacidade", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            });
        }
    };

    return (
        <div className="mx-4 md:mx-6 lg:mx-8 my-6">
            {/* Buttons Container */}
            <div className="mb-6 flex gap-2">
                {/* Add Reservation Button */}
                <AlertDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Reserva
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-3xl">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-[#8B4513] font-serif">
                                Nova Reserva
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AddReservationForm
                            onSuccess={handleAddSuccess}
                            selectedDate={selectedDate}
                            periodCounts={periodCounts}
                            capacityValues={capacityValues}
                        />
                    </AlertDialogContent>
                </AlertDialog>

                {/* Capacity Settings Button */}
                <AlertDialog open={isCapacityDialogOpen} onOpenChange={setIsCapacityDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" className="border-[#8B4513] text-[#8B4513] hover:bg-[#FAEBD7]">
                            <Settings2 className="w-4 h-4 mr-2" />
                            Configurar Capacidade
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-bold text-[#8B4513] font-serif">
                                Configurar Capacidade Máxima
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                        Café da Manhã
                                    </label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={capacityValues.cafe}
                                        onChange={(e) => handleCapacityChange('cafe', Number(e.target.value))}
                                        className="border-[#DEB887] focus:ring-[#8B4513]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                        Almoço
                                    </label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={capacityValues.almoco}
                                        onChange={(e) => handleCapacityChange('almoco', Number(e.target.value))}
                                        className="border-[#DEB887] focus:ring-[#8B4513]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[#8B4513] mb-2">
                                        Jantar
                                    </label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={capacityValues.jantar}
                                        onChange={(e) => handleCapacityChange('jantar', Number(e.target.value))}
                                        className="border-[#DEB887] focus:ring-[#8B4513]"
                                    />
                                </div>
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="border-[#DEB887] text-[#8B4513]">
                                Cancelar
                            </AlertDialogCancel>
                            <Button
                                onClick={handleCapacitySubmit}
                                className="bg-[#8B4513] hover:bg-[#654321] text-white"
                            >
                                Salvar Alterações
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

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
                                        "focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2"
                                    )}
                                    disabled={isFiltering}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0 bg-white"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={handleDateSelect}
                                    disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Can't select past dates
                                        date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Can't select dates more than 3 months in advance
                                    }
                                    initialFocus
                                    locale={ptBR}
                                    className="rounded-md border border-[#DEB887] bg-white"
                                    classNames={{
                                        months: "space-y-4",
                                        month: "space-y-4",
                                        caption: "flex justify-center pt-1 relative items-center text-[#8B4513] font-semibold",
                                        caption_label: "text-sm font-medium",
                                        nav: "space-x-1 flex items-center",
                                        nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-[#FAEBD7] text-[#8B4513]",
                                        nav_button_previous: "absolute left-1",
                                        nav_button_next: "absolute right-1",
                                        table: "w-full border-collapse space-y-1",
                                        head_row: "flex",
                                        head_cell: "text-[#8B4513] rounded-md w-9 font-normal text-[0.8rem]",
                                        row: "flex w-full mt-2",
                                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#FAEBD7] first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: cn(
                                            "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-[#FAEBD7] hover:text-[#8B4513]",
                                            "rounded-md"
                                        ),
                                        day_selected: "bg-[#8B4513] text-white hover:bg-[#654321] hover:text-white focus:bg-[#8B4513] focus:text-white",
                                        day_today: "bg-[#FAEBD7] text-[#8B4513]",
                                        day_outside: "text-gray-400 opacity-50",
                                        day_disabled: "text-gray-400 opacity-50 hover:bg-transparent",
                                        day_range_middle: "aria-selected:bg-[#FAEBD7] aria-selected:text-[#8B4513]",
                                        day_hidden: "invisible",
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                {/* Period Filters with Counters */}
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

            {/* Capacity Display Section */}
            <div className="mb-6 p-6 border border-[#DEB887] rounded-lg bg-[#FAEBD7] shadow-sm">
                <h3 className="text-xl font-serif font-semibold text-[#8B4513] mb-6">
                    Capacidade por Período
                </h3>

                <div className="grid grid-cols-3 gap-6">
                    {/* Café da Manhã */}
                    <div className="bg-white p-4 rounded-lg border border-[#DEB887]">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-[#8B4513]" />
                            <h4 className="font-medium text-[#8B4513]">
                                Café da Manhã
                            </h4>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-[#D2691E]">Ocupação</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {periodCounts.cafe}/{capacityValues.cafe}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#D2691E]">Disponível</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {capacityValues.cafe - periodCounts.cafe}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Almoço */}
                    <div className="bg-white p-4 rounded-lg border border-[#DEB887]">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-[#8B4513]" />
                            <h4 className="font-medium text-[#8B4513]">
                                Almoço
                            </h4>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-[#D2691E]">Ocupação</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {periodCounts.almoco}/{capacityValues.almoco}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#D2691E]">Disponível</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {capacityValues.almoco - periodCounts.almoco}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Jantar */}
                    <div className="bg-white p-4 rounded-lg border border-[#DEB887]">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-5 h-5 text-[#8B4513]" />
                            <h4 className="font-medium text-[#8B4513]">
                                Jantar
                            </h4>
                        </div>
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-sm text-[#D2691E]">Ocupação</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {periodCounts.jantar}/{capacityValues.jantar}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-[#D2691E]">Disponível</p>
                                <p className="text-2xl font-semibold text-[#8B4513]">
                                    {capacityValues.jantar - periodCounts.jantar}
                                </p>
                            </div>
                        </div>
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
                                                <AlertDialogContent className="p-0">
                                                    <AlertDialogHeader className="p-4 pb-2">
                                                        <AlertDialogTitle className="text-xl font-bold text-[#8B4513] font-serif">
                                                            Editar Reserva
                                                        </AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <EditReservationForm
                                                        reservation={reservation}
                                                        onSuccess={async () => {
                                                            // Refresh reservations after edit
                                                            await refreshReservations();
                                                            await updatePeriodCounts(selectedDate);
                                                            window.location.reload();
                                                        }}
                                                        periodCounts={periodCounts}
                                                        capacityValues={capacityValues}
                                                        onDateChange={async (date) => {
                                                            // Update period counts and capacity values for the new date
                                                            const formattedDate = format(date, 'yyyy-MM-dd');
                                                            await loadCapacityValues(date);
                                                            await updatePeriodCounts(date);
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