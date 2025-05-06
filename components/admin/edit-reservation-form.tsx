'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { User, Mail, Phone, Calendar as CalendarIcon, Clock, Users } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { updateReservation } from "@/app/actions/reservations"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format, addMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string()
        .min(14, "Telefone inválido")
        .max(15, "Telefone inválido")
        .regex(/^\(\d{2}\) \d{5}-\d{4}$/, "Formato inválido. Use: (99) 99999-9999"),
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Horário é obrigatório"),
    guests: z.coerce.number()
        .min(1, "Mínimo de 1 pessoa")
        .max(20, "Máximo de 20 pessoas por reserva"),
    mealPeriod: z.enum(["cafe", "almoco", "jantar"], {
        required_error: "Selecione o período da refeição",
    }),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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
}

export function EditReservationForm({ reservation, onSuccess }: EditReservationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        reservation.date ? new Date(reservation.date) : undefined
    );

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: reservation.name,
            email: reservation.email,
            phone: reservation.phone,
            date: reservation.date,
            time: reservation.time,
            guests: reservation.guests,
            mealPeriod: reservation.mealPeriod as "cafe" | "almoco" | "jantar",
            notes: reservation.notes,
        },
    });

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

    const getTimeOptions = (period: string) => {
        switch (period) {
            case "cafe":
                return { min: "08:00", max: "11:00" };
            case "almoco":
                return { min: "11:30", max: "15:00" };
            case "jantar":
                return { min: "18:00", max: "22:00" };
            default:
                return { min: "08:00", max: "20:00" };
        }
    };

    const mealPeriod = form.watch("mealPeriod");
    const timeOptions = getTimeOptions(mealPeriod);

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true);
            const result = await updateReservation(reservation.id, data);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Reserva Atualizada!", {
                description: "As alterações foram salvas com sucesso.",
            });
            onSuccess?.();
        } catch (error) {
            toast.error("Erro ao Atualizar", {
                description: error instanceof Error ? error.message : "Não foi possível atualizar a reserva. Por favor, tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        Nome Completo
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Digite o nome"
                                            className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                            <Mail className="w-4 h-4" />
                                            Email
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="email@exemplo.com"
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Telefone
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="(99) 99999-9999"
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                                {...field}
                                                onChange={handlePhoneChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    {/* Meal Period Selection */}
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="mealPeriod"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel className="text-[#8B4513] font-semibold">Período da Refeição</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col sm:flex-row gap-6"
                                        >
                                            <FormItem className="flex items-start space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="cafe" className="mt-1" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <span>☕</span>
                                                        <span>Café da Manhã</span>
                                                    </div>
                                                    <span className="block text-sm text-[#8B4513]/70">8h - 11h</span>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-start space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="almoco" className="mt-1" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <span>🍽️</span>
                                                        <span>Almoço</span>
                                                    </div>
                                                    <span className="block text-sm text-[#8B4513]/70">11:30h - 15h</span>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-start space-x-2">
                                                <FormControl>
                                                    <RadioGroupItem value="jantar" className="mt-1" />
                                                </FormControl>
                                                <FormLabel className="font-normal cursor-pointer">
                                                    <div className="flex items-center gap-2">
                                                        <span>🌙</span>
                                                        <span>Jantar</span>
                                                    </div>
                                                    <span className="block text-sm text-[#8B4513]/70">18h - 22h</span>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Reservation Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        Data
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="flex h-8 w-full rounded-md border border-[#DEB887]/50 bg-white px-3 py-2 text-sm text-[#8B4513] hover:bg-[#FAEBD7] hover:cursor-pointer">
                                                {field.value ? (
                                                    format(new Date(field.value), "dd/MM/yyyy", { locale: ptBR })
                                                ) : (
                                                    <span className="text-[#8B4513]/60">Selecione uma data</span>
                                                )}
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => {
                                                    if (date) {
                                                        const formattedDate = format(date, 'yyyy-MM-dd');
                                                        field.onChange(formattedDate);
                                                    }
                                                }}
                                                disabled={(date) =>
                                                    date < new Date(new Date().setHours(0, 0, 0, 0))
                                                }
                                                initialFocus
                                                locale={ptBR}
                                                className="rounded-md border border-[#DEB887]"
                                                classNames={{
                                                    day_selected: "bg-[#8B4513] text-white hover:bg-[#654321] hover:text-white focus:bg-[#8B4513] focus:text-white",
                                                    day_today: "bg-[#FAEBD7] text-[#8B4513]",
                                                    day: "hover:bg-[#FAEBD7] hover:text-[#8B4513] focus:bg-[#FAEBD7] focus:text-[#8B4513]",
                                                    caption: "text-[#8B4513]",
                                                    nav_button_previous: "hover:bg-[#FAEBD7] text-[#8B4513]",
                                                    nav_button_next: "hover:bg-[#FAEBD7] text-[#8B4513]",
                                                    head_cell: "text-[#8B4513]"
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage className="text-xs" />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Horário
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="time"
                                            min={timeOptions.min}
                                            max={timeOptions.max}
                                            className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="guests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                        <Users className="w-4 h-4" />
                                        Pessoas
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min="1"
                                            max="20"
                                            className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Notes */}
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                    Observações
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Adicione observações sobre a reserva..."
                                        className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold py-3"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                <span>Salvando...</span>
                            </div>
                        ) : (
                            "Salvar Alterações"
                        )}
                    </Button>
                </form>
            </Form>
        </div>
    );
} 