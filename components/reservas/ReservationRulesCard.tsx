import { Card } from "@/components/ui/card"
import { Info } from "lucide-react"

const rules = [
    "Reservas devem ser feitas com pelo menos 24 horas de antecedência",
    "Para grupos acima de 10 pessoas, faça a reserva com 48 horas de antecedência",
    "Tolerância de 15 minutos para atrasos",
    "Cancelamentos devem ser feitos com 12 horas de antecedência",
    "Reservas são confirmadas após resposta da nossa equipe"
]

export function ReservationRulesCard() {
    return (
        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                    <Info className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                    Regras de Reserva
                </h3>
            </div>
            <ul className="space-y-4 text-[#8B4513]">
                {rules.map((rule) => (
                    <li key={rule} className="flex items-start gap-3 group">
                        <span className="w-2 h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" />
                        <span className="flex-1">{rule}</span>
                    </li>
                ))}
            </ul>
        </Card>
    )
} 