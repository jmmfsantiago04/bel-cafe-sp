import { Card } from "@/components/ui/card"
import { MessageSquare, CheckCircle2 } from "lucide-react"

const requiredInfo = [
    "Nome completo",
    "Data desejada",
    "Horário preferido",
    "Número de pessoas"
]

export function WhatsAppCard() {
    return (
        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                    <MessageSquare className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                    Reservas via WhatsApp
                </h3>
            </div>
            <div className="space-y-4">
                <p className="text-[#8B4513]">
                    Para fazer sua reserva, envie uma mensagem para nosso WhatsApp com as seguintes informações:
                </p>
                <ul className="space-y-3 text-[#8B4513] ml-4">
                    {requiredInfo.map((info) => (
                        <li key={info} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#D2691E]" />
                            <span>{info}</span>
                        </li>
                    ))}
                </ul>
                <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-3 rounded-lg hover:bg-[#128C7E] transition-colors"
                >
                    <MessageSquare className="w-5 h-5" />
                    Fazer Reserva no WhatsApp
                </a>
            </div>
        </Card>
    )
} 