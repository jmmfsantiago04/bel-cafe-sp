import { db } from "@/lib/db"
import { businessHours } from "@/db/schema"
import { BusinessHoursTable } from "@/app/admin/hours/components/business-hours-table"
import { BusinessHoursForm } from "@/app/admin/hours/components/business-hours-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { BusinessHoursFormData } from "@/app/actions/business-hours"

export default async function BusinessHoursPage() {
    const result = await db.query.businessHours.findMany()

    // Type cast the period to match BusinessHoursFormData
    const hours = result.map(hour => ({
        ...hour,
        period: hour.period as "cafe" | "almoco" | "jantar" | "geral"
    })) satisfies BusinessHoursFormData[]

    return (
        <div className="container mx-auto py-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-[#4A2512]">Horários de Funcionamento</h1>
                <p className="text-[#8B4513]/80 mt-2">
                    Gerencie os horários de funcionamento do estabelecimento
                </p>
            </header>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-[#4A2512]">
                            Horários
                        </CardTitle>
                        <CardDescription>
                            Configure os horários para cada período
                        </CardDescription>
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#8B4513] hover:bg-[#4A2512]">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Horário
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <BusinessHoursForm />
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent>
                    <BusinessHoursTable initialHours={hours} />
                </CardContent>
            </Card>
        </div>
    )
} 