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
import { type AboutContentFormData, type AboutContentResponse, aboutContentFormSchema } from "@/app/types/about"

interface AboutContentFormProps {
    selectedContent: AboutContentResponse | null
    onSubmit: (values: AboutContentFormData) => Promise<void>
    onCancel: () => void
}

const sectionLabels = {
    story: "História",
    team: "Equipe",
    contact: "Contato"
}

export function AboutContentForm({ selectedContent, onSubmit, onCancel }: AboutContentFormProps) {
    const form = useForm<AboutContentFormData>({
        resolver: zodResolver(aboutContentFormSchema),
        defaultValues: {
            section: selectedContent?.section ?? "story",
            title: selectedContent?.title ?? "",
            content: selectedContent?.content ?? "",
            imageUrl: selectedContent?.imageUrl ?? null,
            displayOrder: selectedContent?.displayOrder ?? 0,
            isActive: selectedContent?.isActive ?? true,
        },
    })

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-2 sm:p-4">
                <FormField
                    control={form.control}
                    name="section"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Seção</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger className="text-sm sm:text-base">
                                        <SelectValue placeholder="Selecione a seção" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Object.entries(sectionLabels).map(([value, label]) => (
                                        <SelectItem key={value} value={value}>{label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Título</FormLabel>
                            <FormControl>
                                <Input className="text-sm sm:text-base" {...field} />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">Conteúdo</FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base resize-y"
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm sm:text-base">URL da Imagem</FormLabel>
                            <FormControl>
                                <Input
                                    className="text-sm sm:text-base"
                                    {...field}
                                    value={field.value || ""}
                                    onChange={(e) => field.onChange(e.target.value || null)}
                                />
                            </FormControl>
                            <FormMessage className="text-xs sm:text-sm" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-3 sm:p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-sm sm:text-base">Ativo</FormLabel>
                                    <CardDescription className="text-xs sm:text-sm">
                                        Determina se este conteúdo está visível
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
                </div>

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