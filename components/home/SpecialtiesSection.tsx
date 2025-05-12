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
        <section className="py-16 bg-[#DEB887]">
            <div className="container mx-auto px-4 text-center">
                <h3 className="text-[#8B4513] text-3xl font-bold mb-12">
                    Nossas Especialidades
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {specialties.map((item, index) => (
                        <div key={index} className="bg-[#F5DEB3] p-6 rounded-lg shadow-lg">
                            <div className="relative h-48 mb-4">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <h4 className="text-[#8B4513] text-xl font-bold mb-2">
                                {item.title}
                            </h4>
                            <p className="text-[#654321]">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
} 