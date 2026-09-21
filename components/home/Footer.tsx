import Link from "next/link"

const navigationLinks = [
    { href: "/", label: "Início" },
    { href: "/menu/cafe-manha", label: "Café da Manhã" },
    { href: "/menu/almoco", label: "Almoço" },
    { href: "/menu/jantar", label: "Jantar" },
    { href: "/menu/bebidas-quentes", label: "Bebidas" },
    { href: "/reservas", label: "Reservas" },
    { href: "/sobre-nos", label: "Sobre Nós" },
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
        <footer className="bg-[#511707] text-[#FDE5B9]">
            <div className="container mx-auto px-4 py-8 sm:py-10 md:py-12">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 md:gap-12">
                    <section className="text-center sm:text-left">
                        <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">É de Chão</h2>
                        <p className="mx-auto mb-4 max-w-sm text-sm opacity-90 sm:mx-0 sm:text-base">
                            Sabores autênticos do Nordeste brasileiro em cada prato,
                            trazendo o aconchego e o afeto da culinária tradicional.
                        </p>
                    </section>

                    <nav className="text-center sm:text-left">
                        <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">Navegação</h2>
                        <ul className="mx-auto grid max-w-sm grid-cols-2 gap-x-4 gap-y-2 sm:mx-0">
                            {navigationLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors hover:text-[#EE8614] sm:text-base"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <address className="text-center not-italic sm:text-left">
                        <h2 className="mb-3 text-lg font-bold sm:mb-4 sm:text-xl">Contato</h2>
                        <ul className="mx-auto max-w-sm space-y-2 text-sm sm:mx-0 sm:text-base">
                            <li>{contactInfo.address}</li>
                            <li>{contactInfo.city}</li>
                            <li>
                                <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="transition-colors hover:text-[#EE8614]">
                                    Tel: {contactInfo.phone}
                                </a>
                            </li>
                            <li>
                                <a href={`https://wa.me/55${contactInfo.whatsapp.replace(/\D/g, '')}`} className="transition-colors hover:text-[#EE8614]">
                                    WhatsApp: {contactInfo.whatsapp}
                                </a>
                            </li>
                            <li>
                                <a href={`mailto:${contactInfo.email}`} className="transition-colors hover:text-[#EE8614]">
                                    Email: {contactInfo.email}
                                </a>
                            </li>
                            <li className="mt-3 sm:mt-4">{contactInfo.hours}</li>
                        </ul>
                    </address>
                </div>

                <small className="mt-6 block border-t border-[#B43D16] pt-6 text-center text-xs sm:mt-8 sm:pt-8 sm:text-sm">
                    © {new Date().getFullYear()} É de Chão - Comida de Afeto. Todos os direitos reservados.
                </small>
            </div>
        </footer>
    )
}
