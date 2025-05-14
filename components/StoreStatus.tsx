'use client'

import { getStoreStatus } from "@/app/actions/store-status"
import { Clock, Store } from "lucide-react"
import { useEffect, useState } from "react"

type StoreStatus = {
    isOpen: boolean
    reason: string | null | undefined
    reopenDate: string | null | undefined
}

export function StoreStatus() {
    const [status, setStatus] = useState<StoreStatus | null>(null)

    useEffect(() => {
        const fetchStatus = async () => {
            const result = await getStoreStatus()
            if (!('error' in result)) {
                // Ensure null values are converted to undefined
                setStatus({
                    isOpen: result.isOpen,
                    reason: result.reason ?? undefined,
                    reopenDate: result.reopenDate ?? undefined
                })
            }
        }

        fetchStatus()
        // Fetch status every 5 minutes
        const interval = setInterval(fetchStatus, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (!status) {
        return null
    }

    return (
        <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-full">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium">
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
        </div>
    )
} 