import Image from "next/image";

export function AboutSection() {
    return (
        <section className="bg-[#09532C] py-8 sm:py-12 md:py-16">
            <article className="container mx-auto grid max-w-6xl grid-cols-1 items-center gap-8 px-4 md:grid-cols-2 md:gap-12">
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-2xl font-bold text-[#FDE5B9] sm:text-3xl md:text-4xl">
                        Nossa História
                    </h2>
                    <p className="text-base text-[#FDE5B9]/90 sm:text-lg md:text-xl">
                        No É de Chão, cada prato conta uma história do sertão, cada sabor traz
                        uma memória da nossa terra. Aqui, a tradição nordestina se encontra com
                        o conforto da comida feita com amor.
                    </p>
                </div>
                <figure className="relative h-[250px] w-full sm:h-[300px] md:h-[400px]">
                    <Image
                        src="/restaurant-interior.jpg"
                        alt="Interior do Restaurante"
                        fill
                        className="rounded-lg object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority
                    />
                </figure>
            </article>
        </section>
    );
}
