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
] as const;

export function SpecialtiesSection() {
    return (
        <section className="py-8 sm:py-12 md:py-16 bg-[#DEB887]">
            <article className="container mx-auto px-4 text-center max-w-6xl">
                <h2 className="text-[#8B4513] text-2xl sm:text-3xl md:text-4xl font-bold mb-8 sm:mb-10 md:mb-12">
                    Nossas Especialidades
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                    {specialties.map((item) => (
                        <li
                            key={item.title}
                            className="bg-[#F5DEB3] p-4 sm:p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
                        >
                            <figure className="relative h-40 sm:h-48 mb-3 sm:mb-4">
                                <Image
                                    src={item.image}
                                    alt={`${item.title} - ${item.description}`}
                                    fill
                                    className="object-cover rounded"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                />
                            </figure>
                            <h3 className="text-[#8B4513] text-lg sm:text-xl font-bold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-[#654321] text-sm sm:text-base">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </article>
        </section>
    );
} 