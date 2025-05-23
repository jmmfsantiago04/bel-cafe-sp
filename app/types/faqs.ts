import { z } from "zod"

export const faqFormSchema = z.object({
    question: z.string().min(2, {
        message: "A pergunta deve ter pelo menos 2 caracteres.",
    }),
    answer: z.string().min(10, {
        message: "A resposta deve ter pelo menos 10 caracteres.",
    }),
    category: z.enum(["common", "services", "other"], {
        required_error: "Selecione uma categoria.",
    }),
    isActive: z.boolean(),
    displayOrder: z.number().min(0),
})

export type FaqFormData = z.infer<typeof faqFormSchema>

export type FaqResponse = {
    id: number
    question: string
    answer: string
    category: "common" | "services" | "other"
    isActive: boolean
    displayOrder: number
    createdAt: Date
    updatedAt: Date
} 