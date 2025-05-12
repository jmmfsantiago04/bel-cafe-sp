import { Building2, Clock, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { BusinessHoursForm } from "@/components/admin/business-hours-form"
import { BusinessHoursTable } from "@/components/admin/business-hours-table"
import { getBusinessHours } from "@/app/actions/business-hours"

export default async function SettingsPage() {
    const result = await getBusinessHours()
    const hours = Array.isArray(result) ? result : []

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-[#4A2512]">Configurações</h2>
            </div>
            <Tabs defaultValue="general" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="general" className="data-[state=active]:bg-[#DEB887] data-[state=active]:text-[#4A2512]">
                        <Settings className="h-4 w-4 mr-2" />
                        Geral
                    </TabsTrigger>
                    <TabsTrigger value="business" className="data-[state=active]:bg-[#DEB887] data-[state=active]:text-[#4A2512]">
                        <Building2 className="h-4 w-4 mr-2" />
                        Estabelecimento
                    </TabsTrigger>
                    <TabsTrigger value="hours" className="data-[state=active]:bg-[#DEB887] data-[state=active]:text-[#4A2512]">
                        <Clock className="h-4 w-4 mr-2" />
                        Horários
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="general" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Sistema</CardTitle>
                            <CardDescription>
                                Configurações gerais do sistema
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#4A2512]">Tema</h3>
                                <p className="text-sm text-[#8B4513]/80">
                                    Escolha entre tema claro ou escuro
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#4A2512]">Idioma</h3>
                                <p className="text-sm text-[#8B4513]/80">
                                    Selecione o idioma do sistema
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="business" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informações do Estabelecimento</CardTitle>
                            <CardDescription>
                                Gerencie as informações do seu estabelecimento
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#4A2512]">Nome</h3>
                                <p className="text-sm text-[#8B4513]/80">
                                    Nome do estabelecimento
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#4A2512]">Endereço</h3>
                                <p className="text-sm text-[#8B4513]/80">
                                    Endereço completo do estabelecimento
                                </p>
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium text-[#4A2512]">Contato</h3>
                                <p className="text-sm text-[#8B4513]/80">
                                    Informações de contato do estabelecimento
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="hours" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Horários de Funcionamento</CardTitle>
                                <CardDescription>
                                    Gerencie os horários de funcionamento do estabelecimento
                                </CardDescription>
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="bg-[#DEB887] text-[#4A2512] hover:bg-[#DEB887]/80">
                                        Adicionar Horário
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogTitle>Adicionar Horário de Funcionamento</DialogTitle>
                                    <BusinessHoursForm />
                                </DialogContent>
                            </Dialog>
                        </CardHeader>
                        <CardContent>
                            <BusinessHoursTable hours={hours} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
} 