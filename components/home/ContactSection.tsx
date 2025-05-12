export function ContactSection() {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-[#8B4513] text-[#F5DEB3]">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 md:mb-8">Venha nos Visitar</h3>
                <div className="max-w-xl mx-auto space-y-3 sm:space-y-4">
                    <p className="text-base sm:text-lg md:text-xl">Rua do Sabor, 123 - São Paulo, SP</p>
                    <p className="text-base sm:text-lg md:text-xl">Terça a Domingo: 11h30 às 23h</p>
                    <button className="w-full sm:w-auto bg-[#F4A460] text-[#8B4513] px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold hover:bg-[#DEB887] transition-colors text-base sm:text-lg">
                        Faça sua Reserva
                    </button>
                </div>
            </div>
        </section>
    );
} 