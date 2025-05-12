import Image from "next/image";

export function AboutSection() {
    return (
        <section className="py-16 bg-[#F4A460]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h3 className="text-[#8B4513] text-3xl font-bold">Nossa História</h3>
                        <p className="text-[#654321] text-lg">
                            No É de Chão, cada prato conta uma história do sertão, cada sabor traz
                            uma memória da nossa terra. Aqui, a tradição nordestina se encontra com
                            o conforto da comida feita com amor.
                        </p>
                    </div>
                    <div className="relative h-[400px]">
                        <Image
                            src="/restaurant-interior.jpg"
                            alt="Interior do Restaurante"
                            fill
                            className="object-cover rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
} 