'use client'

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateReservation } from "@/app/actions/reservations"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useState } from "react"
import { toast } from "sonner"
import * as z from "zod"

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

interface EditReservationFormProps {
    reservation: {
        id: number;
        name: string;
        email: string;
        phone: string;
        date: string;
        time: string;
        guests: number;
        mealPeriod: string;
        notes?: string;
    };
    onSuccess?: () => void;
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
    onDateChange?: (date: Date) => void;
}

export function EditReservationForm({
    reservation,
    onSuccess,
    periodCounts,
    capacityValues,
    onDateChange
}: EditReservationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [date, setDate] = useState<Date>(() => {
        const date = new Date(reservation.date + 'T12:00:00');
        return date;
    });

    // Função para verificar se há vagas disponíveis
    const checkAvailability = (period: string, guests: number) => {
        const currentCount = periodCounts[period as keyof typeof periodCounts];
        const maxCapacity = capacityValues[period as keyof typeof capacityValues];
        const available = maxCapacity - currentCount;
        // Add current reservation's guests to available if it's the same period
        if (period === reservation.mealPeriod) {
            return (available + reservation.guests) >= guests;
        }
        return available >= guests;
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: new Date(reservation.date + 'T12:00:00'),
            time: reservation.time,
            guests: reservation.guests,
            mealPeriod: reservation.mealPeriod as "cafe" | "almoco" | "jantar",
            notes: reservation.notes,
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

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // Verificar disponibilidade antes de enviar
            if (!checkAvailability(values.mealPeriod, values.guests)) {
                const currentCount = periodCounts[values.mealPeriod as keyof typeof periodCounts];
                const maxCapacity = capacityValues[values.mealPeriod as keyof typeof capacityValues];
                const available = maxCapacity - currentCount;
                const extraAvailable = values.mealPeriod === reservation.mealPeriod ? reservation.guests : 0;
                throw new Error(`Não há vagas suficientes para ${values.guests} pessoas neste período. Vagas disponíveis: ${available + extraAvailable}`);
            }

            setIsSubmitting(true)

            // Format the date to match the expected format in the database
            const date = new Date(values.date.getTime() + values.date.getTimezoneOffset() * 60000);
            const formattedDate = format(date, "yyyy-MM-dd")

            const result = await updateReservation(reservation.id, {
                ...values,
                date: formattedDate,
            })

            if ('error' in result) {
                throw new Error(result.error)
            }

            toast.success("Reserva atualizada com sucesso!", {
                description: "As alterações foram salvas.",
            })

            onSuccess?.()
        } catch (error) {
            toast.error("Erro ao atualizar reserva", {
                description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                <FormItem>
                                    <FormLabel>Data</FormLabel>
                                    <FormControl>
                                        <DatePicker
                                            date={field.value}
                                            setDate={(date) => {
                                                field.onChange(date);
                                                onDateChange?.(date);
                                            }}
                                        />
                                    </FormControl>
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
                                                disabled={periodCounts.cafe >= capacityValues.cafe && field.value !== "cafe"}
                                            >
                                                Café da Manhã ({capacityValues.cafe - periodCounts.cafe + (field.value === "cafe" ? reservation.guests : 0)} vagas)
                                            </SelectItem>
                                            <SelectItem
                                                value="almoco"
                                                disabled={periodCounts.almoco >= capacityValues.almoco && field.value !== "almoco"}
                                            >
                                                Almoço ({capacityValues.almoco - periodCounts.almoco + (field.value === "almoco" ? reservation.guests : 0)} vagas)
                                            </SelectItem>
                                            <SelectItem
                                                value="jantar"
                                                disabled={periodCounts.jantar >= capacityValues.jantar && field.value !== "jantar"}
                                            >
                                                Jantar ({capacityValues.jantar - periodCounts.jantar + (field.value === "jantar" ? reservation.guests : 0)} vagas)
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                    {field.value && (
                                        <p className="text-sm text-[#8B4513] mt-1">
                                            Vagas disponíveis: {
                                                capacityValues[field.value as keyof typeof capacityValues] -
                                                periodCounts[field.value as keyof typeof periodCounts] +
                                                (field.value === reservation.mealPeriod ? reservation.guests : 0)
                                            }
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
                        {isSubmitting ? "Atualizando reserva..." : "Atualizar Reserva"}
                    </Button>
                </form>
            </Form>
        </div>
    )
} 