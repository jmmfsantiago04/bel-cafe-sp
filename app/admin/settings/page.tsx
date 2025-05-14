import { StoreStatusForm } from "@/components/admin/store-status-form"
import { StoreStatus } from "@/components/admin/StoreStatus"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
    return (
        <div className="container mx-auto py-6 space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-[#4A2512]">Configurações</h1>
                <p className="text-[#8B4513]/80 mt-2">
                    Gerencie as configurações do estabelecimento
                </p>
            </header>

            {/* Store Status Section */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-[#4A2512] flex items-center gap-4">
                        Status do Estabelecimento
                        <StoreStatus />
                    </CardTitle>
                    <CardDescription>
                        Gerencie o status de funcionamento do estabelecimento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StoreStatusForm />
                </CardContent>
            </Card>
        </div>
    )
} 