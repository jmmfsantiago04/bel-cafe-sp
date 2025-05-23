'use client'

import { useEffect, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getActiveFaqs } from "@/app/actions/faqs"
import { type FaqResponse } from "@/app/types/faqs"

export function CommonQuestions() {
    const [faqs, setFaqs] = useState<FaqResponse[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadFaqs() {
            try {
                const result = await getActiveFaqs()
                if (result.data) {
                    // Cast the category to the correct type
                    const typedFaqs = result.data.map(faq => ({
                        ...faq,
                        category: faq.category as "common" | "services" | "other"
                    }))
                    setFaqs(typedFaqs.filter(faq => faq.category === "common"))
                }
            } catch (error) {
                console.error("Error loading FAQs:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadFaqs()
    }, [])

    if (isLoading) {
        return (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Sobre o Café</h2>
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-2">
                            <div className="h-6 bg-[#2B4C5C]/10 rounded" />
                            <div className="h-16 bg-[#2B4C5C]/5 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#2B4C5C] mb-6">Sobre o Café</h2>
            <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq) => (
                    <AccordionItem key={faq.id} value={`faq-${faq.id}`}>
                        <AccordionTrigger className="text-[#2B4C5C] hover:text-[#C84C28] text-left">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-[#2B4C5C]/80">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
                {faqs.length === 0 && (
                    <div className="text-[#2B4C5C]/80 text-center py-4">
                        Nenhuma pergunta encontrada nesta categoria.
                    </div>
                )}
            </Accordion>
        </div>
    )
} 