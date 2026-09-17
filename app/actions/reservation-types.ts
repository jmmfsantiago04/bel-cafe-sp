import { z } from "zod"

export const reservationFormSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    email: z.string().email({
        message: "Digite um email válido.",
    }),
    phone: z.string().min(10, {
        message: "Digite um número de telefone válido.",
    }),
    // Server receives yyyy-MM-dd, not a Date
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Data inválida.",
    }),
    time: z.string().min(1, {
        message: "Selecione um horário para a reserva.",
    }),
    guests: z.number().int().min(1).max(20),
    mealPeriod: z.enum(["cafe", "almoco", "jantar"]),
    notes: z.string().optional().nullable(),
    status: z
        .enum(["pending", "confirmed", "cancelled", "completed", "no_show"])
        .optional(),
})

export type ReservationFormData = z.infer<typeof reservationFormSchema>