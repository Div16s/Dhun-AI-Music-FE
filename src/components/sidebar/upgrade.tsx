"use client";
import { Sparkles } from "lucide-react"

import { Button } from "../ui/button"
import { authClient } from "~/lib/auth-client"

export default function Upgrade() {
    const upgrade = async () => {
        await authClient.checkout({
            products: [
                "9969b522-e380-47d6-b22d-bdb6e4fb46b7",
                "0e2d6143-eb90-4de3-af11-e2a07e9e21b5",
                "cb698d5d-88c8-428d-b3a4-e39ba8012723"
            ]
        })
    }
    return (
        <Button
            onClick={upgrade}
            size="sm"
            className="h-7 cursor-pointer gap-1 px-2.5 text-xs font-semibold"
        >
            <Sparkles className="size-3.5" />
            Upgrade
        </Button>
    )
}
