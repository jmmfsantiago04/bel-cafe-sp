'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { User, Mail, Phone, Calendar, Clock, Users } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { createReservation } from "@/app/actions/reservations"

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
});

type FormData = z.infer<typeof formSchema>;

export function BookingForm() {
    const [isLoading, setIsLoading] = useState(false);

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
            const result = await createReservation(data);

            if ('error' in result) {
                throw new Error(result.error);
            }

            toast.success("Reserva Recebida!", {
                description: "Entraremos em contato em breve para confirmar sua reserva.",
            });
            form.reset();
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Não foi possível processar sua reserva. Por favor, tente novamente.";

            // Show specific message for capacity limit
            if (errorMessage.includes("não há mais vagas")) {
                toast.error("Sem Vagas Disponíveis", {
                    description: errorMessage,
                });
            } else {
                toast.error("Erro na Reserva", {
                    description: errorMessage,
                });
            }
        } finally {
            setIsLoading(false);
        }
    }

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-[#FDF5E6]/60 backdrop-blur-sm rounded-xl p-6 border border-[#DEB887]/30 shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        {/* Personal Information */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#8B4513]">
                                Informações Pessoais
                            </h3>
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
                                                    placeholder="Digite seu nome"
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
                                                        placeholder="seu@email.com"
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
                                                        placeholder="(11) 98765-4321"
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
                        </div>

                        {/* Meal Period Selection */}
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#8B4513]">
                                Período da Refeição
                            </h3>
                            <FormField
                                control={form.control}
                                name="mealPeriod"
                                render={({ field }) => (
                                    <FormItem className="space-y-3">
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
                        <div className="space-y-6">
                            <h3 className="text-xl font-semibold text-[#8B4513]">
                                Detalhes da Reserva
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Data
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="date"
                                                    min={today}
                                                    className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white rounded-lg"
                                                    placeholder="dd/mm/aaaa"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
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
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold py-3 transition-all duration-300 rounded-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Processando...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Calendar className="w-5 h-5" />
                                    <span>Fazer Reserva</span>
                                </div>
                            )}
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 