import { Card } from "@/components/ui/card"
import { db } from "@/lib/db"
import { menuItems, reservations } from "@/db/schema"
import { count } from "drizzle-orm"
import { and, eq } from "drizzle-orm"
import { format } from "date-fns"
import {
    Coffee,
    UtensilsCrossed,
    Moon,
    Calendar,
    Users,
    ShoppingBag,
    Star,
    Tag
} from "lucide-react"

export default async function AdminDashboard() {
    const today = format(new Date(), 'yyyy-MM-dd');

    // Fetch all stats in parallel using Promise.all
    const [
        totalItems,
        popularItems,
        discountedItems,
        totalReservations,
        breakfastReservations,
        lunchReservations,
        dinnerReservations,
    ] = await Promise.all([
        db.select({ value: count() }).from(menuItems).then(result => result[0]),
        db.select({ value: count() }).from(menuItems).where(eq(menuItems.isPopular, true)).then(result => result[0]),
        db.select({ value: count() }).from(menuItems).where(eq(menuItems.isDiscounted, true)).then(result => result[0]),
        // Reservation counts
        db.select({ value: count() }).from(reservations).where(eq(reservations.date, today)).then(result => result[0]),
        db.select({ value: count() }).from(reservations).where(and(eq(reservations.date, today), eq(reservations.mealPeriod, 'cafe'))).then(result => result[0]),
        db.select({ value: count() }).from(reservations).where(and(eq(reservations.date, today), eq(reservations.mealPeriod, 'almoco'))).then(result => result[0]),
        db.select({ value: count() }).from(reservations).where(and(eq(reservations.date, today), eq(reservations.mealPeriod, 'jantar'))).then(result => result[0]),
    ]).catch(error => {
        console.error('Error fetching dashboard data:', error)
        return [
            { value: 0 }, { value: 0 }, { value: 0 },
            { value: 0 }, { value: 0 }, { value: 0 }, { value: 0 }
        ]
    })

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col space-y-2">
                    <h1 className="text-3xl font-bold text-[#8B4513]">Dashboard</h1>
                    <p className="text-[#D2691E]">Visão geral do seu negócio</p>
                </div>

                {/* Menu Stats Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#8B4513]">Cardápio</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <ShoppingBag className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Total de Itens</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{totalItems.value}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <Star className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Itens Populares</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{popularItems.value}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <Tag className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Em Promoção</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{discountedItems.value}</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <Calendar className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Reservas Hoje</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{totalReservations.value}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                {/* Reservations Stats Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#8B4513]">Reservas por Período</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <Coffee className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Café da Manhã</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{breakfastReservations.value}</p>
                                    <p className="text-xs text-[#D2691E]">8h às 11h</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <UtensilsCrossed className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Almoço</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{lunchReservations.value}</p>
                                    <p className="text-xs text-[#D2691E]">11:30h às 15h</p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6 bg-white shadow-md border border-[#DEB887] hover:shadow-lg transition-shadow">
                            <div className="flex items-center space-x-4">
                                <div className="p-3 bg-[#FDF5E6] rounded-full">
                                    <Moon className="h-6 w-6 text-[#8B4513]" />
                                </div>
                                <div>
                                    <p className="text-sm text-[#D2691E]">Jantar</p>
                                    <p className="text-2xl font-bold text-[#8B4513]">{dinnerReservations.value}</p>
                                    <p className="text-xs text-[#D2691E]">18h às 22h</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
} 