import { Calendar } from "lucide-react"

export function PageHeader() {
    return (
        <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-block mb-6">
                <div className="relative">
                    <Calendar className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D2691E] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">☕</span>
                    </div>
                </div>
            </div>
            <h1 className="text-5xl font-bold text-[#8B4513] mb-6 font-serif">
                Faça sua Reserva
            </h1>
            <p className="text-[#D2691E] text-lg max-w-2xl mx-auto leading-relaxed">
                Reserve sua mesa no É de Chão através do nosso WhatsApp e garanta uma experiência única
                com nossa culinária nordestina especial.
            </p>
            <div className="flex items-center justify-center space-x-4 mt-8">
                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                <span className="text-[#D2691E] font-serif text-2xl">☕</span>
                <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
            </div>
        </div>
    )
} 