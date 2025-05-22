import { Card } from "@/components/ui/card"
import { MessageSquare, CheckCircle2 } from "lucide-react"

const requiredInfo = [
    "Nome completo",
    "Data desejada",
    "Horário preferido",
    "Número de pessoas"
] as const;

export function WhatsAppCard() {
    return (
        <Card className="p-4 sm:p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="p-1.5 sm:p-2 bg-[#FDF5E6] rounded-lg" aria-hidden="true">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#8B4513] font-serif">
                    Reservas via WhatsApp
                </h2>
            </header>

            <section className="space-y-3 sm:space-y-4">
                <p className="text-[#8B4513] text-sm sm:text-base">
                    Para fazer sua reserva, envie uma mensagem para nosso WhatsApp com as seguintes informações:
                </p>

                <ul className="space-y-2 sm:space-y-3 text-[#8B4513] ml-2 sm:ml-4">
                    {requiredInfo.map((info) => (
                        <li key={info} className="flex items-center gap-2 sm:gap-3">
                            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D2691E] flex-shrink-0" aria-hidden="true" />
                            <span className="text-sm sm:text-base">{info}</span>
                        </li>
                    ))}
                </ul>

                <a
                    href="https://wa.me/5511999999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 sm:mt-6 w-full bg-[#25D366] text-white flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-lg hover:bg-[#128C7E] transition-colors text-sm sm:text-base"
                >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
                    Fazer Reserva no WhatsApp
                </a>
            </section>
        </Card>
    )
} 