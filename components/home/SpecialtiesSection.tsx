import Image from "next/image";

const specialties = [
    {
        title: "Pratos Típicos",
        description: "O melhor da culinária nordestina",
        image: "/typical-dishes.jpg",
    },
    {
        title: "Bebidas Regionais",
        description: "Sabores únicos do Nordeste",
        image: "/drinks.jpg",
    },
    {
        title: "Sobremesas Caseiras",
        description: "Doces que abraçam a alma",
        image: "/desserts.jpg",
    },
] as const;

export function SpecialtiesSection() {
    return (
        <section className="bg-[#FDE5B9] py-8 sm:py-12 md:py-16">
            <article className="container mx-auto max-w-6xl px-4 text-center">
                <h2 className="mb-8 text-2xl font-bold text-[#B43D16] sm:mb-10 sm:text-3xl md:mb-12 md:text-4xl">
                    Nossas Especialidades
                </h2>

                <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
                    {specialties.map((item) => (
                        <li
                            key={item.title}
                            className="transform rounded-lg bg-[#FFF8EC] p-4 shadow-lg transition-transform duration-300 hover:scale-105 sm:p-6"
                        >
                            <figure className="relative mb-3 h-40 sm:mb-4 sm:h-48">
                                <Image
                                    src={item.image}
                                    alt={`${item.title} - ${item.description}`}
                                    fill
                                    className="rounded object-cover"
                                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                                />
                            </figure>
                            <h3 className="mb-2 text-lg font-bold text-[#B43D16] sm:text-xl">
                                {item.title}
                            </h3>
                            <p className="text-sm text-[#7E3117] sm:text-base">
                                {item.description}
                            </p>
                        </li>
                    ))}
                </ul>
            </article>
        </section>
    );
}
