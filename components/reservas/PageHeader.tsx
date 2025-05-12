import { Calendar } from "lucide-react"

export function PageHeader() {
    return (
        <header className="text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto px-4">
            <span className="inline-block mb-4 sm:mb-6 relative">
                <Calendar className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 text-[#8B4513] mx-auto mb-2 sm:mb-4" aria-hidden="true" />
                <span className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-[#D2691E] rounded-full flex items-center justify-center" aria-hidden="true">
                    <span className="text-white text-xs sm:text-sm">☕</span>
                </span>
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#8B4513] mb-4 sm:mb-6 font-serif">
                Faça sua Reserva
            </h1>

            <p className="text-[#D2691E] text-base sm:text-lg max-w-xl sm:max-w-2xl mx-auto leading-relaxed px-4">
                Reserve sua mesa no É de Chão através do nosso WhatsApp e garanta uma experiência única
                com nossa culinária nordestina especial.
            </p>

            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mt-6 sm:mt-8" aria-hidden="true">
                <span className="h-[1px] sm:h-[2px] w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                <span className="text-[#D2691E] font-serif text-xl sm:text-2xl">☕</span>
                <span className="h-[1px] sm:h-[2px] w-16 sm:w-24 md:w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
            </div>
        </header>
    )
} 