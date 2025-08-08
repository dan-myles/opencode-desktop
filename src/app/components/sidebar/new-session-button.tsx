import { useNavigate } from "@tanstack/react-router"
import { Plus } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/app/lib/utils"
import { Shorcut } from "../shortcut"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

export function NewSessionButton({ className }: { className?: string }) {
  const navigate = useNavigate()

  const handleNewSession = () => {
    navigate({ to: "/" })
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handleNewSession}
          className={cn("w-full justify-start gap-2", className)}
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Session
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        <Shorcut label="Settings" kbd="o" />
      </TooltipContent>
    </Tooltip>
  )
}
