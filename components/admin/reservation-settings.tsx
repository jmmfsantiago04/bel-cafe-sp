'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Card } from "@/components/ui/card"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Coffee, UtensilsCrossed, Moon, Users, Clock } from "lucide-react"
import { getReservationSettings, updateReservationSettings, getTodayReservations } from "@/app/actions/reservations"

const formSchema = z.object({
    maxBreakfast: z.coerce.number()
        .min(1, "Capacidade mínima é 1")
        .max(100, "Capacidade máxima é 100"),
    maxLunch: z.coerce.number()
        .min(1, "Capacidade mínima é 1")
        .max(100, "Capacidade máxima é 100"),
    maxDinner: z.coerce.number()
        .min(1, "Capacidade mínima é 1")
        .max(100, "Capacidade máxima é 100"),
});

type FormData = z.infer<typeof formSchema>;

export function ReservationSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [todayReservations, setTodayReservations] = useState({
        cafe: 0,
        almoco: 0,
        jantar: 0,
    });

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            maxBreakfast: 30,
            maxLunch: 50,
            maxDinner: 40,
        },
    });

    useEffect(() => {
        async function loadSettings() {
            const settings = await getReservationSettings();
            if (!('error' in settings)) {
                form.reset({
                    maxBreakfast: settings.maxBreakfast,
                    maxLunch: settings.maxLunch,
                    maxDinner: settings.maxDinner,
                });
            }
        }

        async function loadTodayReservations() {
            const reservations = await getTodayReservations();
            setTodayReservations(reservations);
        }

        loadSettings();
        loadTodayReservations();
    }, [form]);

    async function onSubmit(data: FormData) {
        try {
            setIsLoading(true);
            const result = await updateReservationSettings({
                maxBreakfast: data.maxBreakfast,
                maxLunch: data.maxLunch,
                maxDinner: data.maxDinner,
            });

            if (result.error) {
                throw new Error(result.error);
            }

            toast.success("Configurações Salvas", {
                description: "As configurações de reserva foram atualizadas com sucesso.",
            });
        } catch (error) {
            toast.error("Erro", {
                description: "Não foi possível salvar as configurações. Tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const maxBreakfast = form.watch("maxBreakfast");
    const maxLunch = form.watch("maxLunch");
    const maxDinner = form.watch("maxDinner");

    const getCapacityColor = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return "text-red-600";
        if (percentage >= 75) return "text-yellow-600";
        return "text-green-600";
    };

    const getCapacityText = (current: number, max: number) => {
        const percentage = (current / max) * 100;
        if (percentage >= 90) return "Quase lotado";
        if (percentage >= 75) return "Bem ocupado";
        return "Disponível";
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-[#8B4513] font-serif">
                    Configurações de Reserva
                </h2>
                <p className="text-[#D2691E] text-sm mt-1">
                    Defina a capacidade máxima de reservas para cada período
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Current Status Cards */}
                <Card className="p-4 border-[#DEB887] bg-white/90">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Coffee className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-[#8B4513]">Café da Manhã</h3>
                            <p className="text-sm text-[#D2691E]">8h às 11h</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-[#8B4513]/70">Reservas Hoje</p>
                            <p className="text-2xl font-bold text-[#8B4513]">{todayReservations.cafe}/{maxBreakfast}</p>
                        </div>
                        <div className={`text-xs ${getCapacityColor(todayReservations.cafe, maxBreakfast)}`}>
                            {getCapacityText(todayReservations.cafe, maxBreakfast)}
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-[#DEB887] bg-white/90">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-50 rounded-lg">
                            <UtensilsCrossed className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-[#8B4513]">Almoço</h3>
                            <p className="text-sm text-[#D2691E]">11:30h às 15h</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-[#8B4513]/70">Reservas Hoje</p>
                            <p className="text-2xl font-bold text-[#8B4513]">{todayReservations.almoco}/{maxLunch}</p>
                        </div>
                        <div className={`text-xs ${getCapacityColor(todayReservations.almoco, maxLunch)}`}>
                            {getCapacityText(todayReservations.almoco, maxLunch)}
                        </div>
                    </div>
                </Card>

                <Card className="p-4 border-[#DEB887] bg-white/90">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <Moon className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-[#8B4513]">Jantar</h3>
                            <p className="text-sm text-[#D2691E]">18h às 22h</p>
                        </div>
                    </div>
                    <div className="mt-3 flex items-end justify-between">
                        <div>
                            <p className="text-sm text-[#8B4513]/70">Reservas Hoje</p>
                            <p className="text-2xl font-bold text-[#8B4513]">{todayReservations.jantar}/{maxDinner}</p>
                        </div>
                        <div className={`text-xs ${getCapacityColor(todayReservations.jantar, maxDinner)}`}>
                            {getCapacityText(todayReservations.jantar, maxDinner)}
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6 border-[#DEB887] bg-white/90">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField
                                control={form.control}
                                name="maxBreakfast"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Café da Manhã
                                        </FormLabel>
                                        <FormDescription className="text-xs text-[#8B4513]/70">
                                            Capacidade máxima para o café da manhã
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={100}
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxLunch"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Almoço
                                        </FormLabel>
                                        <FormDescription className="text-xs text-[#8B4513]/70">
                                            Capacidade máxima para o almoço
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={100}
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxDinner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-[#8B4513] flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Jantar
                                        </FormLabel>
                                        <FormDescription className="text-xs text-[#8B4513]/70">
                                            Capacidade máxima para o jantar
                                        </FormDescription>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={100}
                                                className="border-[#DEB887]/50 focus:border-[#8B4513] bg-white"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                className="bg-[#8B4513] hover:bg-[#654321] text-white font-bold"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Salvando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Salvar Configurações</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
} 