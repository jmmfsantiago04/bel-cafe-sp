import { Card } from "@/components/ui/card"
import { Clock } from "lucide-react"

const businessHours = [
    {
        days: "Segunda - Sexta",
        hours: "8:00 - 20:00"
    },
    {
        days: "Sábado",
        hours: "9:00 - 20:00"
    },
    {
        days: "Domingo",
        hours: "9:00 - 18:00"
    }
] as const;

export function BusinessHoursCard() {
    return (
        <Card className="p-4 sm:p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="p-1.5 sm:p-2 bg-[#FDF5E6] rounded-lg" aria-hidden="true">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#8B4513] font-serif">
                    Horário de Funcionamento
                </h2>
            </header>

            <ul className="space-y-2 sm:space-y-3 text-[#8B4513]">
                {businessHours.map((schedule) => (
                    <li
                        key={schedule.days}
                        className={`flex flex-col sm:flex-row justify-between items-start sm:items-center py-2 ${schedule.days !== businessHours[businessHours.length - 1].days ? 'border-b border-[#DEB887]/30' : ''
                            }`}
                    >
                        <span className="font-medium text-sm sm:text-base mb-1 sm:mb-0">
                            {schedule.days}
                        </span>
                        <time className="bg-[#FDF5E6] px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm w-fit">
                            {schedule.hours}
                        </time>
                    </li>
                ))}
            </ul>
        </Card>
    );
} 