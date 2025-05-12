export function ContactSection() {
    return (
        <section className="py-16 bg-[#8B4513] text-[#F5DEB3]">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-3xl font-bold mb-8">Venha nos Visitar</h3>
                <div className="max-w-xl mx-auto space-y-4">
                    <p className="text-lg">Rua do Sabor, 123 - São Paulo, SP</p>
                    <p className="text-lg">Terça a Domingo: 11h30 às 23h</p>
                    <button className="bg-[#F4A460] text-[#8B4513] px-8 py-3 rounded-full font-bold hover:bg-[#DEB887] transition-colors">
                        Faça sua Reserva
                    </button>
                </div>
            </div>
        </section>
    );
} 