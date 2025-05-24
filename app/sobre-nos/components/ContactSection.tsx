import { MapPin, Clock, Phone, Mail } from "lucide-react"

const contactInfo = [
    {
        icon: MapPin,
        title: "Endereço",
        info: "Rua das Flores, 123 - Jardim Paulista, São Paulo - SP"
    },
    {
        icon: Clock,
        title: "Horário de Funcionamento",
        info: "Segunda a Sábado: 7h às 20h\nDomingo: 8h às 18h"
    },
    {
        icon: Phone,
        title: "Telefone",
        info: "(11) 9999-9999"
    },
    {
        icon: Mail,
        title: "E-mail",
        info: "contato@edechao.com.br"
    }
]

export function ContactSection() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Onde Nos Encontrar</h2>

            <div className="space-y-6">
                {/* Map */}
                <div className="relative h-48 md:h-64 rounded-xl overflow-hidden bg-[#2B4C5C]/5">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1598831726257!2d-46.6558391!3d-23.5617001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzQyLjEiUyA0NsKwMzknMjEuMCJX!5e0!3m2!1spt-BR!2sbr!4v1635789876543!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {contactInfo.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-[#2B4C5C]/5">
                            <item.icon className="w-5 h-5 text-[#8B4513] shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-medium text-[#2B4C5C]">
                                    {item.title}
                                </h3>
                                <p className="text-[#2B4C5C]/80 text-sm whitespace-pre-line">
                                    {item.info}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Social Links */}
                <div className="text-center pt-4">
                    <p className="text-[#2B4C5C]/80 text-sm">
                        Siga-nos nas redes sociais para novidades e promoções
                    </p>
                    <div className="flex justify-center gap-4 mt-3">
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B4513] hover:text-[#4A2512] transition-colors"
                        >
                            Instagram
                        </a>
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B4513] hover:text-[#4A2512] transition-colors"
                        >
                            Facebook
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
} 