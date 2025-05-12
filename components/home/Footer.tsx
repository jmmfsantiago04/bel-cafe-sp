import Link from "next/link"

const navigationLinks = [
    { href: "/", label: "Início" },
    { href: "/menu/cafe-manha", label: "Café da Manhã" },
    { href: "/menu/almoco", label: "Almoço" },
    { href: "/menu/jantar", label: "Jantar" },
    { href: "/menu/bebidas-quentes", label: "Bebidas" },
    { href: "/reservas", label: "Reservas" },
    { href: "/sobre", label: "Sobre Nós" },
    { href: "/duvidas", label: "Dúvidas" },
    { href: "/blog", label: "Blog" },
]

const contactInfo = {
    address: "Rua dos Sabores, 123 - Jardim Paulista",
    city: "São Paulo - SP",
    phone: "(11) 98765-4321",
    whatsapp: "(11) 98765-4321",
    email: "contato@edechao.com.br",
    hours: "Terça a Domingo: 07h às 22h"
}

export function Footer() {
    return (
        <footer className="bg-[#654321] text-[#F5DEB3]">
            <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
                    <section className="text-center sm:text-left">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">É de Chão</h2>
                        <p className="text-sm sm:text-base opacity-90 mb-4 max-w-sm mx-auto sm:mx-0">
                            Sabores autênticos do Nordeste brasileiro em cada prato,
                            trazendo o aconchego e o afeto da culinária tradicional.
                        </p>
                    </section>

                    <nav className="text-center sm:text-left">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Navegação</h2>
                        <ul className="grid grid-cols-2 gap-x-4 gap-y-2 max-w-sm mx-auto sm:mx-0">
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm sm:text-base hover:text-[#DEB887] transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <address className="text-center sm:text-left not-italic">
                        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Contato</h2>
                        <ul className="space-y-2 text-sm sm:text-base max-w-sm mx-auto sm:mx-0">
                            <li>{contactInfo.address}</li>
                            <li>{contactInfo.city}</li>
                            <li>
                                <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="hover:text-[#DEB887] transition-colors">
                                    Tel: {contactInfo.phone}
                                </a>
                            </li>
                            <li>
                                <a href={`https://wa.me/55${contactInfo.whatsapp.replace(/\D/g, '')}`} className="hover:text-[#DEB887] transition-colors">
                                    WhatsApp: {contactInfo.whatsapp}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#DEB887] transition-colors">
                                    Email: {contactInfo.email}
                                </a>
                            </li>
                            <li className="mt-3 sm:mt-4">{contactInfo.hours}</li>
                        </ul>
                    </address>
                </div>

                <small className="block border-t border-[#8B4513] mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
                    © {new Date().getFullYear()} É de Chão - Comida de Afeto. Todos os direitos reservados.
                </small>
            </div>
        </footer>
    )
} 