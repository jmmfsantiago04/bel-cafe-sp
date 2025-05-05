'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { User, Mail, Phone, Calendar as CalendarIcon, Clock, Users, FileText } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createReservationByAdmin } from "@/app/actions/reservations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
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
    status: z.enum(["pending", "confirmed", "cancelled", "completed", "no_show"], {
        required_error: "Selecione o status da reserva",
    }),
    notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const statusOptions = [
    { value: "pending", label: "Pendente" },
    { value: "confirmed", label: "Confirmada" },
    { value: "cancelled", label: "Cancelada" },
    { value: "completed", label: "Concluída" },
    { value: "no_show", label: "Não Compareceu" },
];

export function AdminBookingForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date>();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            date: "",
            time: "",
            guests: 1,
            mealPeriod: "cafe",
            status: "pending",
            notes: "",
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
            const result = await createReservationByAdmin(data);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Reserva Criada!", {
                description: "A reserva foi criada com sucesso.",
            });
            form.reset();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Não foi possível criar a reserva.";
            toast.error("Erro na Reserva", {
                description: errorMessage,
            });
        } finally {
            setIsLoading(false);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#8B4513]">
                                Informações do Cliente
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                <User className="w-4 h-4" />
                                                Nome Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite o nome"
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                <Mail className="w-4 h-4" />
                                                Email
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="email@exemplo.com"
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                <Phone className="w-4 h-4" />
                                                Telefone
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="(11) 98765-4321"
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9"
                                                    {...field}
                                                    onChange={handlePhoneChange}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="status"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                Status
                                            </FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9">
                                                        <SelectValue placeholder="Selecione o status" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {statusOptions.map((status) => (
                                                        <SelectItem key={status.value} value={status.value}>
                                                            {status.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Meal Period Selection */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#8B4513]">
                                Período da Refeição
                            </h3>
                            <FormField
                                control={form.control}
                                name="mealPeriod"
                                render={({ field }) => (
                                    <FormItem className="space-y-2">
                                        <FormControl>
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col sm:flex-row gap-4"
                                            >
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value="cafe" className="mt-1" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>☕</span>
                                                            <span>Café da Manhã</span>
                                                        </div>
                                                        <span className="block text-xs text-[#8B4513]/70">8h - 11h</span>
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value="almoco" className="mt-1" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>🍽️</span>
                                                            <span>Almoço</span>
                                                        </div>
                                                        <span className="block text-xs text-[#8B4513]/70">11:30h - 15h</span>
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-start space-x-2">
                                                    <FormControl>
                                                        <RadioGroupItem value="jantar" className="mt-1" />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <span>🌙</span>
                                                            <span>Jantar</span>
                                                        </div>
                                                        <span className="block text-xs text-[#8B4513]/70">18h - 22h</span>
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Reservation Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#8B4513]">
                                Detalhes da Reserva
                            </h3>
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
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            className={`w-full pl-3 text-left font-normal border-[#DEB887]/50 hover:bg-[#FAEBD7] hover:text-[#8B4513] ${!field.value && "text-muted-foreground"}`}
                                                        >
                                                            {field.value ? (
                                                                format(new Date(field.value), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
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
                                                        selected={selectedDate}
                                                        onSelect={(date) => {
                                                            setSelectedDate(date);
                                                            if (date) {
                                                                field.onChange(format(date, 'yyyy-MM-dd'));
                                                            }
                                                        }}
                                                        disabled={(date) =>
                                                            date < new Date(new Date().setHours(0, 0, 0, 0))
                                                        }
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="time"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4" />
                                                Horário
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="time"
                                                    min={timeOptions.min}
                                                    max={timeOptions.max}
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="guests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                                <Users className="w-4 h-4" />
                                                Pessoas
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white h-9"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[#8B4513]">
                                Observações
                            </h3>
                            <FormField
                                control={form.control}
                                name="notes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2 text-sm">
                                            <FileText className="w-4 h-4" />
                                            Anotações Administrativas
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Adicione observações sobre a reserva..."
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white min-h-[80px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-xs" />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold h-9 text-sm"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processando...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>Criar Reserva</span>
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    );
} 