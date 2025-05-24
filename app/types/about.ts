import { z } from "zod"

export const aboutContentFormSchema = z.object({
    section: z.enum(["story", "team", "contact"], {
        required_error: "Selecione uma seção.",
    }),
    title: z.string().min(2, {
        message: "O título deve ter pelo menos 2 caracteres.",
    }),
    content: z.string().min(10, {
        message: "O conteúdo deve ter pelo menos 10 caracteres.",
    }),
    imageUrl: z.string().url({
        message: "Digite uma URL válida para a imagem.",
    }).nullable(),
    displayOrder: z.number().min(0),
    isActive: z.boolean(),
})

export type AboutContentFormData = z.infer<typeof aboutContentFormSchema>

export type AboutContentResponse = {
    id: number
    section: "story" | "team" | "contact"
    title: string
    content: string
    imageUrl: string | null
    displayOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
} 