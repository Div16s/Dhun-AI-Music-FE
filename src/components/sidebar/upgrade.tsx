import { Sparkles } from "lucide-react"

import { Button } from "../ui/button"

export default function Upgrade() {
    return (
        <Button
            size="sm"
            className="h-7 cursor-pointer gap-1 px-2.5 text-xs font-semibold"
        >
            <Sparkles className="size-3.5" />
            Upgrade
        </Button>
    )
}
