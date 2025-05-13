import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"
import { db } from "@/lib/db"
import { businessHours } from "@/db/schema"

type Period = "cafe" | "almoco" | "jantar" | "geral"

type BusinessHour = {
    id: number
    period: Period
    weekdays: string
    openTime: string
    closeTime: string
    isActive: boolean
    isGeneralHours?: boolean
}

const periodLabels: Record<Period, string> = {
    geral: "Horário Geral",
    cafe: "Café da Manhã",
    almoco: "Almoço",
    jantar: "Jantar"
}

export async function BusinessHoursCard() {
    const hours = await db.query.businessHours.findMany() as BusinessHour[]

    const activeHours = hours?.filter(hour => hour.isActive) || []

    // Ordem definida dos períodos
    const periodOrder: Record<Period, number> = {
        geral: 0,
        cafe: 1,
        almoco: 2,
        jantar: 3
    }

    // Separar horário geral dos específicos
    const generalHours = activeHours.find(hour => hour.period === 'geral')
    const specificHours = activeHours
        .filter(hour => hour.period !== 'geral')
        .sort((a, b) => periodOrder[a.period] - periodOrder[b.period])

    return (
        <Card className="p-4 sm:p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span
                    className="p-1.5 sm:p-2 bg-[#FDF5E6] rounded-lg"
                    aria-hidden="true"
                >
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#8B4513] font-serif">
                    Horário de Funcionamento
                </h2>
            </header>

            {activeHours.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                    {/* Horário Geral */}
                    {generalHours && (
                        <div className="pb-3 sm:pb-4 border-b border-[#DEB887]/30">
                            <p className="text-sm sm:text-base text-[#8B4513]/80 mb-1">
                                {generalHours.weekdays}
                            </p>
                            <time
                                className="text-base sm:text-lg font-medium text-[#8B4513]"
                                dateTime={`${generalHours.openTime}-${generalHours.closeTime}`}
                            >
                                {generalHours.openTime}h às {generalHours.closeTime}h
                            </time>
                        </div>
                    )}

                    {/* Horários Específicos */}
                    {specificHours.length > 0 && (
                        <ul className="space-y-2 sm:space-y-3">
                            {specificHours.map((schedule) => (
                                <li
                                    key={schedule.id}
                                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 border-b border-[#DEB887]/30 last:border-0"
                                >
                                    <div className="space-y-1 mb-2 sm:mb-0">
                                        <h3 className="font-medium text-sm sm:text-base">
                                            {periodLabels[schedule.period]}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-[#8B4513]/80">
                                            {schedule.weekdays}
                                        </p>
                                    </div>
                                    <time
                                        className="bg-[#FDF5E6] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm w-fit"
                                        dateTime={`${schedule.openTime}-${schedule.closeTime}`}
                                    >
                                        {schedule.openTime}h às {schedule.closeTime}h
                                    </time>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ) : (
                <div className="text-center py-4 text-[#8B4513]/70 text-sm">
                    Horários não disponíveis no momento.
                </div>
            )}
        </Card>
    )
} 