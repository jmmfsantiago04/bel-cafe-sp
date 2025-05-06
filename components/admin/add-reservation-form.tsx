'use client'

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { createReservationByAdmin } from "@/app/actions/reservations"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

// Time slots for each meal period
const timeSlots = {
    cafe: ["07:00", "08:00", "09:00", "10:00", "11:00"],
    almoco: ["12:00", "13:00", "14:00", "15:00"],
    jantar: ["18:00", "19:00", "20:00", "21:00"]
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Digite um email válido.",
    }),
    phone: z.string().min(10, {
        message: "Digite um número de telefone válido.",
    }),
    date: z.date({
        required_error: "Selecione uma data para a reserva.",
    }),
    time: z.string({
        required_error: "Selecione um horário para a reserva.",
    }),
    guests: z.number().min(1, {
        message: "Mínimo de 1 pessoa por reserva.",
    }).max(20, {
        message: "Máximo de 20 pessoas por reserva.",
    }),
    mealPeriod: z.enum(["cafe", "almoco", "jantar"], {
        required_error: "Selecione o período da refeição.",
    }),
    notes: z.string().optional(),
})

export function AddReservationForm({
    onSuccess,
    selectedDate,
    periodCounts,
    capacityValues
}: {
    onSuccess?: () => void
    selectedDate: Date
    periodCounts: {
        cafe: number
        almoco: number
        jantar: number
    }
    capacityValues: {
        cafe: number
        almoco: number
        jantar: number
    }
}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [date, setDate] = useState<Date>(selectedDate)

    // Função para verificar se há vagas disponíveis
    const checkAvailability = (period: string, guests: number) => {
        const currentCount = periodCounts[period as keyof typeof periodCounts];
        const maxCapacity = capacityValues[period as keyof typeof capacityValues];
        const available = maxCapacity - currentCount;
        return available >= guests;
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            guests: 1,
            notes: "",
            date: selectedDate,
        },
    })

    // Format phone number as user types
    const formatPhoneNumber = (value: string) => {
        const digits = value.replace(/\D/g, "");
        if (digits.length <= 2) return digits;
        if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formatted = formatPhoneNumber(e.target.value);
        form.setValue("phone", formatted);
    };

    // Handle date change
    const handleDateChange = (date: Date | undefined) => {
        if (date) {
            setDate(date);
            form.setValue('date', date);
        }
    };

    // Reset form and date
    const handleReset = () => {
        form.reset({
            name: "",
            email: "",
            phone: "",
            guests: 1,
            notes: "",
            date: selectedDate,
        });
        setDate(selectedDate);
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Verificar disponibilidade antes de enviar
            if (!checkAvailability(values.mealPeriod, values.guests)) {
                const currentCount = periodCounts[values.mealPeriod as keyof typeof periodCounts];
                const maxCapacity = capacityValues[values.mealPeriod as keyof typeof capacityValues];
                const available = maxCapacity - currentCount;
                throw new Error(`Não há vagas suficientes para ${values.guests} pessoas neste período. Vagas disponíveis: ${available}`);
            }

            setIsSubmitting(true)

            // Format the date to match the expected format in the database
            const date = new Date(values.date);
            date.setHours(12, 0, 0, 0); // Define meio-dia para evitar problemas de fuso horário
            const formattedDate = format(date, "yyyy-MM-dd")

            const result = await createReservationByAdmin({
                ...values,
                date: formattedDate,
                status: "pending",
            })

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Reserva criada com sucesso!", {
                description: "A reserva foi adicionada ao sistema.",
            })

            handleReset();
            onSuccess?.()
        } catch (error) {
            toast.error("Erro ao criar reserva", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome do cliente" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input type="email" placeholder="email@exemplo.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Phone Field */}
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="(00) 00000-0000"
                                        {...field}
                                        onChange={handlePhoneChange}
                                        maxLength={15}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Number of Guests Field */}
                    <FormField
                        control={form.control}
                        name="guests"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Número de Pessoas</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={20}
                                        {...field}
                                        value={field.value || 1}
                                        onChange={(e) => {
                                            const value = parseInt(e.target.value);
                                            field.onChange(isNaN(value) ? 1 : value);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Date Field */}
                    <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !date && "text-muted-foreground",
                                                    "border-[#DEB887] hover:bg-[#FAEBD7] hover:text-[#8B4513]",
                                                    "focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2",
                                                    "bg-white"
                                                )}
                                            >
                                                {date ? (
                                                    format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                                                ) : (
                                                    <span>Selecione uma data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateChange}
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
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Meal Period Field */}
                    <FormField
                        control={form.control}
                        name="mealPeriod"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Período</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o período" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value="cafe"
                                            disabled={periodCounts.cafe >= capacityValues.cafe}
                                        >
                                            Café da Manhã ({capacityValues.cafe - periodCounts.cafe} vagas)
                                        </SelectItem>
                                        <SelectItem
                                            value="almoco"
                                            disabled={periodCounts.almoco >= capacityValues.almoco}
                                        >
                                            Almoço ({capacityValues.almoco - periodCounts.almoco} vagas)
                                        </SelectItem>
                                        <SelectItem
                                            value="jantar"
                                            disabled={periodCounts.jantar >= capacityValues.jantar}
                                        >
                                            Jantar ({capacityValues.jantar - periodCounts.jantar} vagas)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                                {field.value && (
                                    <p className="text-sm text-[#8B4513] mt-1">
                                        Vagas disponíveis: {capacityValues[field.value as keyof typeof capacityValues] - periodCounts[field.value as keyof typeof periodCounts]}
                                    </p>
                                )}
                            </FormItem>
                        )}
                    />

                    {/* Time Field */}
                    <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Horário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o horário" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {form.watch("mealPeriod") && timeSlots[form.watch("mealPeriod") as keyof typeof timeSlots].map((time) => (
                                            <SelectItem key={time} value={time}>
                                                {time}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Notes Field */}
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Observações</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Adicione observações sobre a reserva (opcional)"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Criando reserva..." : "Criar Reserva"}
                </Button>
            </form>
        </Form>
    )
} 