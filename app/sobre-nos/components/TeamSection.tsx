import Image from "next/image"

const team = [
    {
        name: "Maria Silva",
        role: "Chef Principal",
        description: "Com mais de 15 anos de experiência em culinária nordestina, Maria traz o verdadeiro sabor de casa para cada prato.",
        image: "/images/team/chef.jpg"
    },
    {
        name: "João Santos",
        role: "Barista Chefe",
        description: "Especialista em café, João é apaixonado por criar experiências únicas através dos melhores grãos selecionados.",
        image: "/images/team/barista.jpg"
    },
    {
        name: "Ana Oliveira",
        role: "Gerente",
        description: "Responsável por garantir que cada cliente tenha uma experiência memorável em nossa casa.",
        image: "/images/team/manager.jpg"
    }
]

export function TeamSection() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Nossa Equipe</h2>

            <div className="space-y-6">
                {team.map((member, index) => (
                    <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-[#2B4C5C]/5">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden shrink-0">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h3 className="text-lg font-medium text-[#2B4C5C]">
                                {member.name}
                            </h3>
                            <p className="text-[#8B4513] font-medium text-sm mb-2">
                                {member.role}
                            </p>
                            <p className="text-[#2B4C5C]/80 text-sm">
                                {member.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
} 