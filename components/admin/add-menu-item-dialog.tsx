import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { MenuItemForm } from "./menu-form";
import { Plus } from "lucide-react";

interface AddMenuItemDialogProps {
    categories: {
        id: number;
        name: string;
        description: string | null;
        isActive: boolean;
    }[];
}

export function AddMenuItemDialog({ categories }: AddMenuItemDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-[#8B4513] hover:bg-[#654321] text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Item
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-center text-2xl font-bold text-[#8B4513] font-serif">
                        Novo Item do Cardápio
                    </DialogTitle>
                </DialogHeader>
                <MenuItemForm categories={categories} />
            </DialogContent>
        </Dialog>
    );
} 