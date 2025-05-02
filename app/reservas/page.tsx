import { BookingForm } from "@/components/booking-form"
import { Card } from "@/components/ui/card"
import { Clock, MapPin, Phone, Mail, Info, Calendar } from "lucide-react"

export default function BookingPage() {
    return (
        <div className="min-h-screen bg-[#FDF5E6] py-12 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#DEB887] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#DEB887] rounded-full opacity-5 translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-[#8B4513] rounded-full opacity-5 -translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-4 relative">
                {/* Header Section */}
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <div className="inline-block mb-6">
                        <div className="relative">
                            <Calendar className="w-16 h-16 text-[#8B4513] mx-auto mb-4" />
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#D2691E] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">☕</span>
                            </div>
                        </div>
                    </div>
                    <h1 className="text-5xl font-bold text-[#8B4513] mb-6 font-serif">
                        Faça sua Reserva
                    </h1>
                    <p className="text-[#D2691E] text-lg max-w-2xl mx-auto leading-relaxed">
                        Planeje sua visita ao Bel Café e garanta uma experiência única com nossa culinária especial.
                        Reserve sua mesa e desfrute dos melhores momentos conosco.
                    </p>
                    <div className="flex items-center justify-center space-x-4 mt-8">
                        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                        <span className="text-[#D2691E] font-serif text-2xl">☕</span>
                        <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Information Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Business Hours */}
                        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                                    <Clock className="w-6 h-6 text-[#8B4513]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                                    Horário de Funcionamento
                                </h3>
                            </div>
                            <div className="space-y-3 text-[#8B4513]">
                                <p className="flex justify-between items-center py-2 border-b border-[#DEB887]/30">
                                    <span className="font-medium">Segunda - Sexta</span>
                                    <span className="bg-[#FDF5E6] px-3 py-1 rounded-full text-sm">8:00 - 20:00</span>
                                </p>
                                <p className="flex justify-between items-center py-2 border-b border-[#DEB887]/30">
                                    <span className="font-medium">Sábado</span>
                                    <span className="bg-[#FDF5E6] px-3 py-1 rounded-full text-sm">9:00 - 20:00</span>
                                </p>
                                <p className="flex justify-between items-center py-2">
                                    <span className="font-medium">Domingo</span>
                                    <span className="bg-[#FDF5E6] px-3 py-1 rounded-full text-sm">9:00 - 18:00</span>
                                </p>
                            </div>
                        </Card>

                        {/* Reservation Info */}
                        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                                    <Info className="w-6 h-6 text-[#8B4513]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                                    Informações Importantes
                                </h3>
                            </div>
                            <ul className="space-y-4 text-[#8B4513]">
                                <li className="flex items-start gap-3 group">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" />
                                    <span className="flex-1">Reservas devem ser feitas com pelo menos 24 horas de antecedência</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" />
                                    <span className="flex-1">Para grupos acima de 10 pessoas, entre em contato por telefone</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" />
                                    <span className="flex-1">Tolerância de 15 minutos para atrasos</span>
                                </li>
                                <li className="flex items-start gap-3 group">
                                    <span className="w-2 h-2 mt-2 rounded-full bg-[#D2691E] group-hover:scale-125 transition-transform" />
                                    <span className="flex-1">Cancelamentos devem ser feitos com 12 horas de antecedência</span>
                                </li>
                            </ul>
                        </Card>

                        {/* Contact */}
                        <Card className="p-6 border-[#DEB887] bg-white/90 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-[#FDF5E6] rounded-lg">
                                    <Phone className="w-6 h-6 text-[#8B4513]" />
                                </div>
                                <h3 className="text-xl font-bold text-[#8B4513] font-serif">
                                    Contato Direto
                                </h3>
                            </div>
                            <div className="space-y-4 text-[#8B4513]">
                                <a href="tel:+551199999999" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors">
                                    <Phone className="w-5 h-5 text-[#D2691E]" />
                                    <span>(11) 99999-9999</span>
                                </a>
                                <a href="mailto:reservas@belcafe.com" className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors">
                                    <Mail className="w-5 h-5 text-[#D2691E]" />
                                    <span>reservas@belcafe.com</span>
                                </a>
                                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#FDF5E6] transition-colors">
                                    <MapPin className="w-5 h-5 text-[#D2691E]" />
                                    <span>Rua do Café, 123 - São Paulo</span>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Booking Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-1">
                            <BookingForm />
                        </div>
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="flex items-center justify-center mt-16 space-x-6">
                    <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                    <div className="w-12 h-12 rounded-full bg-[#FDF5E6] flex items-center justify-center border-2 border-[#DEB887]">
                        <span className="text-[#D2691E] font-serif text-xl">♦</span>
                    </div>
                    <div className="h-[2px] w-32 bg-gradient-to-r from-transparent via-[#DEB887] to-transparent" />
                </div>
            </div>
        </div>
    )
} 