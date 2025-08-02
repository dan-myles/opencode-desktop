import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Link, useParams } from "@tanstack/react-router"
import { MoreHorizontal, Trash2 } from "lucide-react"

import type { Session } from "@/server/routers/session/types"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { api } from "@/app/lib/api"
import { cn } from "@/app/lib/utils"

interface SessionItemProps {
  session: Session
}

export function SessionItem({ session }: SessionItemProps) {
  const params = useParams({ strict: false })
  const isActive = params.sessionId === session.id

  return (
    <Link
      to="/session/$sessionId"
      params={{ sessionId: session.id }}
      className={cn(
        `hover:bg-accent group flex items-center gap-2 rounded-md p-2
        transition-colors`,
        isActive && "bg-primary text-primary-foreground hover:bg-primary/90",
      )}
      viewTransition
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-xs font-medium">
            {session.title || "New Session"}
          </h3>
        </div>
      </div>
    </Link>
  )
}
