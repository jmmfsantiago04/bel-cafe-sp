import { getStoreStatus } from "@/app/actions/store-status"
import { Clock, Store } from "lucide-react"

export async function StoreStatus() {
    const status = await getStoreStatus()

    if ('error' in status) {
        return null
    }

    return (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium">
            <div className={`flex items-center gap-2 ${status.isOpen ? 'text-green-600' : 'text-red-600'}`}>
                <Store className="w-4 h-4" />
                <span>{status.isOpen ? 'Aberto' : 'Fechado'}</span>
                {status.isOpen && (
                    <>
                        <span className="w-1 h-1 rounded-full bg-current" />
                        <Clock className="w-4 h-4" />
                        <span>Agora</span>
                    </>
                )}
            </div>
            {!status.isOpen && status.reason && (
                <div className="text-gray-600 text-xs">
                    <p>{status.reason}</p>
                    {status.reopenDate && (
                        <p className="mt-0.5">
                            Reabre: {status.reopenDate}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
} 