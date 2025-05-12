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
]

export function BusinessHoursCard() {
    return (
        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                    <Clock className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                    Horário de Funcionamento
                </h3>
            </div>
            <div className="space-y-3 text-[#8B4513]">
                {businessHours.map((schedule, index) => (
                    <p
                        key={schedule.days}
                        className={`flex justify-between items-center py-2 ${index !== businessHours.length - 1 ? 'border-b border-[#DEB887]/30' : ''
                            }`}
                    >
                        <span className="font-medium">{schedule.days}</span>
                        <span className="bg-[#FDF5E6] px-3 py-1 rounded-full text-sm">
                            {schedule.hours}
                        </span>
                    </p>
                ))}
            </div>
        </Card>
    )
} 