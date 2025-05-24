import { Heart, Leaf, Coffee, Users } from "lucide-react"

const values = [
    {
        icon: Heart,
        title: "Afeto em Cada Detalhe",
        description: "Colocamos amor e carinho em cada prato e bebida que servimos, garantindo que cada cliente se sinta especial."
    },
    {
        icon: Leaf,
        title: "Ingredientes Frescos",
        description: "Utilizamos ingredientes frescos e de qualidade, priorizando fornecedores locais e produtos sazonais."
    },
    {
        icon: Coffee,
        title: "Café de Qualidade",
        description: "Selecionamos os melhores grãos e preparamos cada café com técnica e dedicação para uma experiência única."
    },
    {
        icon: Users,
        title: "Ambiente Acolhedor",
        description: "Criamos um espaço onde todos se sintam bem-vindos, como se estivessem na casa de um amigo querido."
    }
]

export function OurValues() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Nossos Valores</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {values.map((value, index) => (
                    <div key={index} className="flex flex-col items-center text-center p-4 rounded-xl bg-[#2B4C5C]/5 hover:bg-[#2B4C5C]/10 transition-colors">
                        <value.icon className="w-8 h-8 text-[#8B4513] mb-3" />
                        <h3 className="text-lg font-medium text-[#2B4C5C] mb-2">
                            {value.title}
                        </h3>
                        <p className="text-[#2B4C5C]/80 text-sm">
                            {value.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
} 