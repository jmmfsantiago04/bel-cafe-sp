import Image from "next/image";

export function HeroSection() {
    return (
        <section className="relative min-h-[500px] h-screen flex items-center justify-center bg-gradient-to-b from-[#8B4513] to-[#654321]">
            <div className="absolute inset-0 bg-[url('/texture-overlay.png')] opacity-20" />
            <div className="container mx-auto px-4 py-8 text-center z-10">
                <div className="relative w-[200px] h-[100px] sm:w-[300px] sm:h-[150px] md:w-[400px] md:h-[200px] mx-auto mb-4 sm:mb-6 md:mb-8">
                    <Image
                        src="/logo.png"
                        alt="É de Chão - Comida de Afeto"
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 200px, (max-width: 768px) 300px, 400px"
                        priority
                    />
                </div>
                <h2 className="text-[#F5DEB3] text-xl sm:text-2xl md:text-3xl font-light mb-4 sm:mb-5 md:mb-6">
                    Comida de Afeto
                </h2>
                <p className="text-[#FFE4B5] text-base sm:text-lg md:text-xl max-w-xl sm:max-w-2xl mx-auto px-4">
                    Sabores autênticos do Nordeste brasileiro em cada prato
                </p>
            </div>
        </section>
    );
} 