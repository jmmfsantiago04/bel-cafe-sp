import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

const rules = [
    "Reservas devem ser feitas com pelo menos 24 horas de antecedência",
    "Para grupos acima de 10 pessoas, faça a reserva com 48 horas de antecedência",
    "Tolerância de 15 minutos para atrasos",
    "Cancelamentos devem ser feitos com 12 horas de antecedência",
    "Reservas são confirmadas após resposta da nossa equipe"
] as const;

export function ReservationRulesCard() {
    return (
        <Card className="p-4 sm:p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="p-1.5 sm:p-2 bg-[#FDF5E6] rounded-lg" aria-hidden="true">
                    <Info className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#8B4513] font-serif">
                    Regras de Reserva
                </h2>
            </header>

            <ul className="space-y-3 sm:space-y-4 text-[#8B4513]">
                {rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-2 sm:gap-3 group">
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" aria-hidden="true" />
                        <span className="flex-1 text-sm sm:text-base">{rule}</span>
                    </li>
                ))}
            </ul>
        </Card>
    )
} 