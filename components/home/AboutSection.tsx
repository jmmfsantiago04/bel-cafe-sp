import Image from "next/image";

export function AboutSection() {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-[#F4A460]">
            <article className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center max-w-6xl">
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-[#8B4513] text-2xl sm:text-3xl md:text-4xl font-bold">
                        Nossa História
                    </h2>
                    <p className="text-[#654321] text-base sm:text-lg md:text-xl">
                        No É de Chão, cada prato conta uma história do sertão, cada sabor traz
                        uma memória da nossa terra. Aqui, a tradição nordestina se encontra com
                        o conforto da comida feita com amor.
                    </p>
                </div>
                <figure className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full">
                    <Image
                        src="/restaurant-interior.jpg"
                        alt="Interior do Restaurante"
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </figure>
            </article>
        </section>
    );
} 