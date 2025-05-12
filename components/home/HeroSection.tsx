import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative h-screen flex items-center justify-center bg-gradient-to-b from-[#8B4513] to-[#654321]">
            <div className="absolute inset-0 bg-[url('/texture-overlay.png')] opacity-20" />
            <div className="container mx-auto px-4 text-center z-10">
                <Image
                    src="/logo.png"
                    alt="É de Chão - Comida de Afeto"
                    width={400}
                    height={200}
                    className="mx-auto mb-8"
                    priority
                />
                <h2 className="text-[#F5DEB3] text-2xl md:text-3xl font-light mb-6">
                    Comida de Afeto
                </h2>
                <p className="text-[#FFE4B5] text-lg md:text-xl max-w-2xl mx-auto">
                    Sabores autênticos do Nordeste brasileiro em cada prato
                </p>
            </div>
        </section>
    );
} 