import { Card } from "@/components/ui/card"
import { getAllReservations } from "@/app/actions/reservations"
import { ReservationsTable } from "@/components/admin/reservations-table"
import { Button } from "@/components/ui/button"
import { Plus, Settings2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AdminBookingForm } from "@/components/admin/admin-booking-form"
import { Suspense } from "react"
import { ReservationSettings } from "@/components/admin/reservation-settings"

export default async function ReservationsPage() {
    const { data: reservations, error } = await getAllReservations()

    if (error) {
        return <div className="text-red-500">{error}</div>
    }

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#8B4513] font-serif">Reservas</h1>
                    <p className="text-[#D2691E] text-sm">Gerencie as reservas do café</p>
                </div>

                <div className="flex gap-3">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white transition-colors">
                                <Settings2 className="w-4 h-4 mr-2" />
                                Configurar Capacidade
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <AlertDialogHeader>
                                <AlertDialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                                    Configurações de Capacidade
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <Suspense fallback={
                                <div className="flex items-center justify-center p-8">
                                    <div className="w-8 h-8 border-4 border-[#DEB887] border-t-[#8B4513] rounded-full animate-spin" />
                                </div>
                            }>
                                <ReservationSettings />
                            </Suspense>
                        </AlertDialogContent>
                    </AlertDialog>

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                                <Plus className="w-4 h-4 mr-2" />
                                Nova Reserva
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 gap-4">
                            <AlertDialogHeader className="pb-4 border-b">
                                <AlertDialogTitle className="text-center text-xl font-bold text-[#8B4513] font-serif">
                                    Nova Reserva
                                </AlertDialogTitle>
                            </AlertDialogHeader>
                            <Suspense fallback={
                                <div className="flex items-center justify-center p-8">
                                    <div className="w-8 h-8 border-4 border-[#DEB887] border-t-[#8B4513] rounded-full animate-spin" />
                                </div>
                            }>
                                <AdminBookingForm />
                            </Suspense>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <ReservationsTable reservations={reservations || []} />
        </div>
    )
}