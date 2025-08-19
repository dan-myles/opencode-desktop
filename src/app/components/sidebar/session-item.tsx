import { Link, useParams } from "@tanstack/react-router"
import { Loader2 } from "lucide-react"

import type { Session } from "@/server/sdk/gen/types.gen"
import { ShimmerContainer } from "@/app/components/ui/shimmer-container"
import { cn } from "@/app/lib/utils"
import { useSessionStateStore } from "@/app/stores/session-state.store"

interface SessionItemProps {
  session: Session
}

export function SessionItem({ session }: SessionItemProps) {
  const params = useParams({ strict: false })
  const isActive = params.sessionId === session.id
  const isGenerating = useSessionStateStore((state) =>
    state.isSessionGenerating(session.id),
  )

  return (
    <ShimmerContainer isAnimating={isGenerating} className="rounded-md">
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
        {isGenerating && (
          <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-xs font-medium">
              {session.title || "New Session"}
            </h3>
          </div>
        </div>
      </Link>
    </ShimmerContainer>
  )
}
