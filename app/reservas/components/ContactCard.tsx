import { Card } from "@/components/ui/card"
import { MapPin, Phone, Mail } from "lucide-react"

const contactInfo = [
    {
        icon: MapPin,
        text: "Rua do Café, 123 - São Paulo",
        href: undefined,
        type: "address"
    },
    {
        icon: Phone,
        text: "(11) 99999-9999",
        href: "tel:+551199999999",
        type: "phone"
    },
    {
        icon: Mail,
        text: "contato@edechao.com",
        href: "mailto:contato@edechao.com",
        type: "email"
    }
] as const;

export function ContactCard() {
    return (
        <Card className="p-4 sm:p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <header className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="p-1.5 sm:p-2 bg-[#FDF5E6] rounded-lg" aria-hidden="true">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-[#8B4513]" />
                </span>
                <h2 className="text-lg sm:text-xl font-bold text-[#8B4513] font-serif">
                    Localização e Contato
                </h2>
            </header>

            <ul className="space-y-2 sm:space-y-4 text-[#8B4513]">
                {contactInfo.map((info) => {
                    const Icon = info.icon;
                    const content = (
                        <>
                            <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#D2691E] flex-shrink-0" aria-hidden="true" />
                            <span className="text-sm sm:text-base">
                                {info.type === "phone" && "Tel: "}
                                {info.type === "email" && "Email: "}
                                {info.text}
                            </span>
                        </>
                    );

                    return (
                        <li key={info.text}>
                            {info.href ? (
                                <a
                                    href={info.href}
                                    className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors"
                                >
                                    {content}
                                </a>
                            ) : (
                                <address className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg not-italic">
                                    {content}
                                </address>
                            )}
                        </li>
                    );
                })}
            </ul>
        </Card>
    );
} 