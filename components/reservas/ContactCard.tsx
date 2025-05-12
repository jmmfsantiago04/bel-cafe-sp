import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail } from "lucide-react"

const contactInfo = [
    {
        icon: MapPin,
        text: "Rua do Café, 123 - São Paulo",
        href: undefined
    },
    {
        icon: Phone,
        text: "(11) 99999-9999",
        href: "tel:+551199999999"
    },
    {
        icon: Mail,
        text: "contato@edechao.com",
        href: "mailto:contato@edechao.com"
    }
]

export function ContactCard() {
    return (
        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                    <MapPin className="w-6 h-6 text-[#8B4513]" />
                </div>
                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                    Localização e Contato
                </h3>
            </div>
            <div className="space-y-4 text-[#8B4513]">
                {contactInfo.map((info) => {
                    const Icon = info.icon
                    const Content = (
                        <>
                            <Icon className="w-5 h-5 text-[#D2691E]" />
                            <span>{info.text}</span>
                        </>
                    )

                    return info.href ? (
                        <a
                            key={info.text}
                            href={info.href}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors"
                        >
                            {Content}
                        </a>
                    ) : (
                        <div
                            key={info.text}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors"
                        >
                            {Content}
                        </div>
                    )
                })}
            </div>
        </Card>
    )
} 