'use client'

import { Button } from "@/components/ui/button"
import { CardDescription } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { type FaqFormData, type FaqResponse, faqFormSchema } from "@/app/types/faqs"

interface FaqFormProps {
    selectedFaq: FaqResponse | null
    onSubmit: (values: FaqFormData) => Promise<void>
    onCancel: () => void
}

export function FaqForm({ selectedFaq, onSubmit, onCancel }: FaqFormProps) {
    const form = useForm<FaqFormData>({
        resolver: zodResolver(faqFormSchema),
        defaultValues: {
            question: selectedFaq?.question ?? "",
            answer: selectedFaq?.answer ?? "",
            category: selectedFaq?.category ?? "common",
            isActive: selectedFaq?.isActive ?? true,
            displayOrder: selectedFaq?.displayOrder ?? 0,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2 sm:p-4">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Pergunta</FormLabel>
                            <FormControl>
                                <Input className="text-sm sm:text-base" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="answer"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Resposta</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="min-h-[100px] sm:min-h-[150px] text-sm sm:text-base resize-y"
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Categoria</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="text-sm sm:text-base">
                                            <SelectValue placeholder="Selecione a categoria" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="common">Perguntas Comuns</SelectItem>
                                        <SelectItem value="services">Serviços & Facilidades</SelectItem>
                                        <SelectItem value="other">Outras</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="displayOrder"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-sm sm:text-base">Ordem de Exibição</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={0}
                                        className="text-sm sm:text-base"
                                        {...field}
                                        value={field.value || 0}
                                        onChange={(e) => {
                                            const value = e.target.value === '' ? 0 : parseInt(e.target.value)
                                            field.onChange(value)
                                        }}
                                    />
                                </FormControl>
                                <FormMessage className="text-xs sm:text-sm" />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-sm sm:text-base">Ativo</FormLabel>
                                <CardDescription className="text-xs sm:text-sm">
                                    Determina se esta pergunta está visível
                                </CardDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-3 sm:gap-4 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="text-sm sm:text-base px-3 sm:px-4 py-2"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-[#8B4513] hover:bg-[#4A2512] text-sm sm:text-base px-3 sm:px-4 py-2"
                    >
                        Salvar
                    </Button>
                </div>
            </form>
        </Form>
    )
} 