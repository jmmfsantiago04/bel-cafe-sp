export function ContactCard() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-4">Ainda tem dúvidas?</h2>
            <p className="text-[#2B4C5C]/80 mb-6">
                Entre em contato conosco que teremos prazer em ajudar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <a
                    href="tel:+551199999999"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#2B4C5C] text-white hover:bg-[#1A3B4B] transition-colors"
                >
                    Ligar para nós
                </a>
                <a
                    href="https://wa.me/551199999999"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#C84C28] text-white hover:bg-[#A33B1D] transition-colors"
                >
                    WhatsApp
                </a>
            </div>
        </div>
    )
} 