import { useQuery } from "@tanstack/react-query"

import type { Session } from "@/server/sdk/gen/types.gen"
import { useSessionNavigation } from "@/app/hooks/use-session-navigation"
import { api } from "@/app/lib/api"
import { useRegisterKeybind } from "@/app/stores/keybind.store"
import { usePinnedSessionsStore } from "@/app/stores/pinned-sessions.store"
import { SessionItem } from "./session-item"

export function SessionList() {
  const {
    data: sessions,
    isLoading,
    error,
  } = useQuery(api.session.list.queryOptions())

  const { navigateToPreviousSession, navigateToNextSession } =
    useSessionNavigation()

  const pinnedSessionIds = usePinnedSessionsStore(
    (state) => state.pinnedSessionIds,
  )

  useRegisterKeybind({
    id: "navigate-session-up",
    keys: {
      darwin: "cmd+p",
      win32: "ctrl+p",
      linux: "ctrl+p",
    },
    description: "Navigate to previous session",
    callback: navigateToPreviousSession,
  })

  useRegisterKeybind({
    id: "navigate-session-down",
    keys: {
      darwin: "cmd+n",
      win32: "ctrl+n",
      linux: "ctrl+n",
    },
    description: "Navigate to next session",
    callback: navigateToNextSession,
  })

  if (error) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        Failed to load sessions
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="text-muted-foreground p-4 text-center text-sm">
        Loading sessions...
      </div>
    )
  }

  const sortedSessions =
    sessions?.sort(
      (a: Session, b: Session) => b.time.updated - a.time.updated,
    ) || []

  const unpinnedSessions = sortedSessions.filter(
    (session) => !pinnedSessionIds.includes(session.id),
  )

  return (
    <div className="max-w-full p-2">
      {sortedSessions.length === 0 ? (
        <div className="text-muted-foreground py-8 text-center text-sm">
          No sessions yet
        </div>
      ) : (
        <>
          {unpinnedSessions.map((session: Session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </>
      )}
    </div>
  )
}
