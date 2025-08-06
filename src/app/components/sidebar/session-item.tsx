import { Link, useParams } from "@tanstack/react-router"

import type { Session } from "@/server/sdk/gen/types.gen"
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
        `hover:bg-accent group flex items-center gap-2 rounded-md p-3
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
