import { Card } from "@/components/ui/card"
import { getAllReservations } from "@/app/actions/reservations"
import { getCapacity } from "@/app/actions/capacity"
import { ReservationsTable } from "@/components/admin/reservations-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogTrigger,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { AddReservationForm } from "@/components/admin/add-reservation-form"
import { Suspense } from "react"
import { format } from "date-fns"

export default async function ReservationsPage() {
    const { data: reservations, error } = await getAllReservations()
    const today = format(new Date(), 'yyyy-MM-dd')
    const capacityResult = await getCapacity(today)
    const capacityValues = 'error' in capacityResult ? { cafe: 30, almoco: 30, jantar: 30 } : capacityResult

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

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                            <Plus className="w-4 h-4 mr-2" />
                            Nova Reserva
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="w-[600px] p-0">
                        <AlertDialogHeader className="p-4 pb-2">
                            <AlertDialogTitle className="text-center text-xl font-bold text-[#8B4513] font-serif">
                                Nova Reserva
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <Suspense fallback={
                            <div className="flex items-center justify-center p-8">
                                <div className="w-8 h-8 border-4 border-[#DEB887] border-t-[#8B4513] rounded-full animate-spin" />
                            </div>
                        }>
                            <AddReservationForm
                                selectedDate={new Date()}
                                periodCounts={{
                                    cafe: 0,
                                    almoco: 0,
                                    jantar: 0
                                }}
                                capacityValues={capacityValues}
                            />
                        </Suspense>
                    </AlertDialogContent>
                </AlertDialog>
            </div>

            <ReservationsTable reservations={reservations || []} />
        </div>
    )
}