'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

export type MenuItem = {
    id: string | number
    name: string
    description: string | null
    price: string | number
    imageUrl: string | null
    isAvailable: boolean
    isPopular: boolean
    // Menu item specific
    isSalgado?: boolean
    isDoce?: boolean
    isCafeDaManha?: boolean
    isAlmoco?: boolean
    isJantar?: boolean
    isSobremesa?: boolean
    // Drink specific
    isHotDrink?: boolean
    isColdDrink?: boolean
}

type MenuItemsTableProps = {
    items: MenuItem[]
    onEdit?: (item: MenuItem) => void
    onDelete?: (item: MenuItem) => void
}

export function MenuItemsTable({ items, onEdit, onDelete }: MenuItemsTableProps) {
    // Filter functions for each category
    const getCafeDaManhaItems = () => items.filter(item => item.isCafeDaManha)
    const getAlmocoItems = () => items.filter(item => item.isAlmoco)
    const getJantarItems = () => items.filter(item => item.isJantar)
    const getSalgadosItems = () => items.filter(item => item.isSalgado)
    const getDocesItems = () => items.filter(item => item.isDoce)
    const getBebidasQuentesItems = () => items.filter(item => item.isHotDrink)
    const getBebidasGeladasItems = () => items.filter(item => item.isColdDrink)
    const getSobremesasItems = () => items.filter(item => item.isSobremesa)
    const getPratosEspeciaisItems = () => items.filter(item => item.isPopular)

    const formatPrice = (price: string | number) => {
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price
        return numericPrice.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })
    }

    const renderTable = (filteredItems: MenuItem[]) => (
        <Table>
            <TableHeader>
                <TableRow className="bg-[#FDF5E6]/50 hover:bg-[#FDF5E6]/50">
                    <TableHead className="font-semibold text-[#8B4513]">Nome</TableHead>
                    <TableHead className="font-semibold text-[#8B4513]">Descrição</TableHead>
                    <TableHead className="font-semibold text-[#8B4513]">Preço</TableHead>
                    <TableHead className="font-semibold text-[#8B4513]">Status</TableHead>
                    <TableHead className="text-right font-semibold text-[#8B4513]">Ações</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {filteredItems.map((item) => (
                    <TableRow key={item.id} className="hover:bg-[#FDF5E6]/20">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-muted-foreground">{item.description || '-'}</TableCell>
                        <TableCell className="font-medium text-[#8B4513]">{formatPrice(item.price)}</TableCell>
                        <TableCell>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.isAvailable
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {item.isAvailable ? 'Disponível' : 'Indisponível'}
                            </span>
                        </TableCell>
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onEdit?.(item)}
                                    className="h-8 w-8 border-[#8B4513]/20 hover:bg-[#8B4513]/10 hover:text-[#8B4513]"
                                >
                                    <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => onDelete?.(item)}
                                    className="h-8 w-8 border-red-200 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
                {filteredItems.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                            Nenhum item encontrado nesta categoria.
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    )

    return (
        <Tabs defaultValue="cafe-da-manha" className="w-full h-full flex flex-col">
            <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 p-1 mx-auto w-full max-w-screen-2xl bg-[#FDF5E6]/50 rounded-lg">
                <TabsTrigger value="cafe-da-manha" className="text-sm">Café da Manhã</TabsTrigger>
                <TabsTrigger value="almoco" className="text-sm">Almoço</TabsTrigger>
                <TabsTrigger value="jantar" className="text-sm">Jantar</TabsTrigger>
                <TabsTrigger value="salgados" className="text-sm">Salgados</TabsTrigger>
                <TabsTrigger value="doces" className="text-sm">Doces</TabsTrigger>
                <TabsTrigger value="bebidas-quentes" className="text-sm">Bebidas Quentes</TabsTrigger>
                <TabsTrigger value="bebidas-geladas" className="text-sm">Bebidas Geladas</TabsTrigger>
                <TabsTrigger value="sobremesas" className="text-sm">Sobremesas</TabsTrigger>
                <TabsTrigger value="pratos-especiais" className="text-sm">Pratos Especiais</TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-6 overflow-hidden">
                <div className="h-full overflow-auto rounded-lg border border-[#D2691E]/20 bg-white shadow-sm">
                    <TabsContent value="cafe-da-manha" className="m-0">
                        {renderTable(getCafeDaManhaItems())}
                    </TabsContent>
                    <TabsContent value="almoco" className="m-0">
                        {renderTable(getAlmocoItems())}
                    </TabsContent>
                    <TabsContent value="jantar" className="m-0">
                        {renderTable(getJantarItems())}
                    </TabsContent>
                    <TabsContent value="salgados" className="m-0">
                        {renderTable(getSalgadosItems())}
                    </TabsContent>
                    <TabsContent value="doces" className="m-0">
                        {renderTable(getDocesItems())}
                    </TabsContent>
                    <TabsContent value="bebidas-quentes" className="m-0">
                        {renderTable(getBebidasQuentesItems())}
                    </TabsContent>
                    <TabsContent value="bebidas-geladas" className="m-0">
                        {renderTable(getBebidasGeladasItems())}
                    </TabsContent>
                    <TabsContent value="sobremesas" className="m-0">
                        {renderTable(getSobremesasItems())}
                    </TabsContent>
                    <TabsContent value="pratos-especiais" className="m-0">
                        {renderTable(getPratosEspeciaisItems())}
                    </TabsContent>
                </div>
            </div>
        </Tabs>
    )
} 