import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[70svh] items-center justify-center md:min-h-[80svh] bg-gradient-to-b from-[#8B4513] to-[#654321]">
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)",
                    backgroundSize: "18px 18px",
                }}
                role="presentation"
                aria-hidden="true"
            />

            <article className="container mx-auto px-4 py-8 text-center z-10 max-w-6xl">
                <figure className="relative mx-auto mb-6 sm:mb-8 w-[min(94vw,56rem)] aspect-[2/1]">
                    <Image
                        src="/logo.png"
                        alt="É de Chão - Comida de Afeto"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 94vw, 56rem"
                        priority
                    />
                </figure>

                <h1 className="text-[#F5DEB3] text-xl sm:text-2xl md:text-3xl font-light mb-4 sm:mb-5 md:mb-6">
                    Comida de Afeto
                </h1>

                <p className="text-[#FFE4B5] text-base sm:text-lg md:text-xl max-w-xl sm:max-w-2xl mx-auto">
                    Sabores autênticos do Nordeste brasileiro em cada prato
                </p>
            </article>
        </section>
    );
}