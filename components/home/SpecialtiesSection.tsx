import Image from "next/image";

const specialties = [
    {
        title: "Pratos Típicos",
        description: "O melhor da culinária nordestina",
        image: "/typical-dishes.jpg"
    },
    {
        title: "Bebidas Regionais",
        description: "Sabores únicos do Nordeste",
        image: "/drinks.jpg"
    },
    {
        title: "Sobremesas Caseiras",
        description: "Doces que abraçam a alma",
        image: "/desserts.jpg"
    }
];

export function SpecialtiesSection() {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-[#DEB887]">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-[#8B4513] text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12">
                    Nossas Especialidades
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
                    {specialties.map((item, index) => (
                        <div
                            key={index}
                            className="bg-[#F5DEB3] p-4 sm:p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <div className="relative h-40 sm:h-48 mb-3 sm:mb-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                />
                            </div>
                            <h4 className="text-[#8B4513] text-lg sm:text-xl font-bold mb-2">
                                {item.title}
                            </h4>
                            <p className="text-[#654321] text-sm sm:text-base">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 