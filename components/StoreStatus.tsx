'use client'

import { getStoreStatus } from "@/app/actions/store-status"
import { Clock, Store } from "lucide-react"
import { useEffect, useState } from "react"

type StoreStatusData = {
    isOpen: boolean
    reason: string | null | undefined
    reopenDate: string | null | undefined
}

export function StoreStatus({ compact = false }: { compact?: boolean }) {
    const [status, setStatus] = useState<StoreStatusData | null>(null)

    useEffect(() => {
        const fetchStatus = async () => {
            const result = await getStoreStatus()
            if (!("error" in result)) {
                setStatus({
                    isOpen: result.isOpen,
                    reason: result.reason ?? undefined,
                    reopenDate: result.reopenDate ?? undefined,
                })
            }
        }

        fetchStatus()
        const interval = setInterval(fetchStatus, 5 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (!status) {
        return null
    }

    return (
        <div
            className={
                compact
                    ? "max-w-[9rem] truncate rounded-full bg-white/80 shadow-lg backdrop-blur-sm"
                    : "rounded-full bg-white/80 shadow-lg backdrop-blur-sm"
            }
        >
            <div
                className={
                    compact
                        ? "flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium"
                        : "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium"
                }
            >
                <div
                    className={`flex min-w-0 items-center gap-1.5 ${
                        status.isOpen ? "text-green-600" : "text-red-600"
                    }`}
                >
                    <Store className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                        {status.isOpen ? "Aberto" : "Fechado"}
                    </span>
                    {!compact && status.isOpen && (
                        <>
                            <span className="h-1 w-1 rounded-full bg-current" />
                            <Clock className="h-4 w-4" />
                            <span>Agora</span>
                        </>
                    )}
                </div>
                {!compact && !status.isOpen && status.reason && (
                    <div className="text-xs text-gray-600">
                        <p>{status.reason}</p>
                        {status.reopenDate && (
                            <p className="mt-0.5">Reabre: {status.reopenDate}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
