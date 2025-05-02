'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState } from "react"
import { toast } from "sonner"
import { User, Mail, Phone, Calendar, Clock, Users, MessageSquare } from "lucide-react"

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
    date: z.string().min(1, "Data é obrigatória"),
    time: z.string().min(1, "Horário é obrigatório"),
    guests: z.coerce.number()
        .min(1, "Mínimo de 1 pessoa")
        .max(20, "Máximo de 20 pessoas por reserva"),
    specialRequests: z.string().optional(),
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
            specialRequests: "",
        },
    });

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true);
            // TODO: Implement booking submission
            console.log(data);

            toast.success("Reserva Recebida!", {
                description: "Entraremos em contato em breve para confirmar sua reserva.",
            });
            form.reset();
        } catch (error) {
            toast.error("Erro na Reserva", {
                description: "Não foi possível processar sua reserva. Por favor, tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    // Get today's date in YYYY-MM-DD format for min date
    const today = new Date().toISOString().split('T')[0];

    return (
        <div className="w-full max-w-2xl mx-auto p-8 space-y-8">
            <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-[#8B4513] font-serif">
                    Formulário de Reserva
                </h2>
                <p className="text-[#D2691E] text-sm italic">
                    Preencha os dados abaixo para fazer sua reserva
                </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-[#DEB887] shadow-lg">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                <User className="w-4 h-4" />
                                                Nome Completo
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Digite seu nome"
                                                    className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
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
                                                <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    Email
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="seu@email.com"
                                                        className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
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
                                                <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    Telefone
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="(11) 99999-9999"
                                                        className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Reservation Details */}
                            <div className="pt-4 border-t border-[#DEB887]/30">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                    <Calendar className="w-4 h-4" />
                                                    Data
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="date"
                                                        min={today}
                                                        className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
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
                                                <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                    <Clock className="w-4 h-4" />
                                                    Horário
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="time"
                                                        min="08:00"
                                                        max="20:00"
                                                        className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Das 8h às 20h
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="guests"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                    <Users className="w-4 h-4" />
                                                    Pessoas
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        max="20"
                                                        className="border-[#DEB887] focus:border-[#8B4513] transition-colors"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs">
                                                    Máx. 20 pessoas
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Special Requests */}
                            <div className="pt-4 border-t border-[#DEB887]/30">
                                <FormField
                                    control={form.control}
                                    name="specialRequests"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-[#8B4513] font-semibold flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" />
                                                Pedidos Especiais
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Alguma solicitação especial? (Opcional)"
                                                    className="border-[#DEB887] focus:border-[#8B4513] transition-colors min-h-[100px] resize-none"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Informe qualquer necessidade especial ou preferência
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-[#8B4513] hover:bg-[#654321] text-white font-bold py-3 transition-all duration-300 relative overflow-hidden group"
                            disabled={isLoading}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Processando...</span>
                                    </>
                                ) : (
                                    <>
                                        <Calendar className="w-5 h-5" />
                                        <span>Fazer Reserva</span>
                                    </>
                                )}
                            </span>
                            <div className="absolute inset-0 bg-[#654321] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 