import { db } from "@/lib/db"
import { businessHours } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function ContactSection() {
    let generalHours: typeof businessHours.$inferSelect | null = null

    try {
        generalHours =
            (await db.query.businessHours.findFirst({
                where: eq(businessHours.isGeneralHours, true),
            })) ?? null
    } catch {
        generalHours = null
    }

    return (
        <section className="bg-[#09532C] py-8 text-[#FDE5B9] sm:py-12 md:py-16">
            <article className="container mx-auto max-w-2xl px-4 text-center">
                <h2 className="mb-6 text-2xl font-bold sm:mb-8 sm:text-3xl md:text-4xl">
                    Venha nos Visitar
                </h2>
                <address className="not-italic space-y-3 sm:space-y-4">
                    <p className="text-base sm:text-lg md:text-xl">Rua do Sabor, 123 - São Paulo, SP</p>
                    {generalHours ? (
                        <p className="text-base sm:text-lg md:text-xl">
                            {generalHours.weekdays}: {generalHours.openTime}h às {generalHours.closeTime}h
                        </p>
                    ) : (
                        <p className="text-base sm:text-lg md:text-xl">
                            Entre em contato para mais informações sobre nossos horários
                        </p>
                    )}
                    <button className="w-full rounded-full bg-[#EE8614] px-6 py-2.5 text-base font-bold text-[#511707] transition-colors hover:bg-[#FFB902] sm:w-auto sm:px-8 sm:py-3 sm:text-lg">
                        Faça sua Reserva
                    </button>
                </address>
            </article>
        </section>
    )
}
