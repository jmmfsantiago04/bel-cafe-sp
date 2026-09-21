import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative flex min-h-[70svh] items-center justify-center md:min-h-[80svh] bg-[#FDE5B9]">
            <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(180,61,22,0.12)_0%,_transparent_65%)]"
                role="presentation"
                aria-hidden="true"
            />

            <article className="container relative z-10 mx-auto max-w-6xl px-4 py-8 text-center">
                <figure className="relative mx-auto mb-6 aspect-[4/3] w-[min(92vw,28rem)] sm:mb-8 sm:aspect-[3/2] sm:w-[min(90vw,32rem)]">
                    <Image
                        src="/logo-lockup.png"
                        alt="É de Chão - Comida de Afeto"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 92vw, 32rem"
                        priority
                    />
                </figure>

                <h1 className="mb-4 font-[family-name:var(--font-display)] text-2xl text-[#511707] sm:mb-5 sm:text-3xl md:mb-6 md:text-4xl">
                    Comida de Afeto
                </h1>

                <p className="mx-auto max-w-xl text-base text-[#7E3117] sm:max-w-2xl sm:text-lg md:text-xl">
                    Sabores autênticos do Nordeste brasileiro em cada prato
                </p>
            </article>
        </section>
    );
}
