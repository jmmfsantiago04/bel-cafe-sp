import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    date?: Date;
    setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left font-normal",
                        !date && "text-muted-foreground",
                        "border-[#DEB887] hover:bg-[#FAEBD7] hover:text-[#8B4513]",
                        "focus:ring-2 focus:ring-[#8B4513] focus:ring-offset-2",
                        "bg-white"
                    )}
                >
                    {date ? (
                        format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                    ) : (
                        <span>Selecione uma data</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => date && setDate(date)}
                    disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0)) || // Can't select past dates
                        date > new Date(new Date().setMonth(new Date().getMonth() + 3)) // Can't select dates more than 3 months in advance
                    }
                    initialFocus
                    locale={ptBR}
                />
            </PopoverContent>
        </Popover>
    );
} 