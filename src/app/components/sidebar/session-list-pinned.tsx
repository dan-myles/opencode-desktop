import { useQuery } from "@tanstack/react-query"

import type { Session } from "@/server/sdk/gen/types.gen"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/app/components/ui/sidebar"
import { api } from "@/app/lib/api"
import { usePinnedSessionsStore } from "@/app/stores/pinned-sessions.store"
import { SessionItem } from "./session-item"

export function SessionListPinned() {
  const { data: sessions } = useQuery(api.session.list.queryOptions())
  const pinnedSessionIds = usePinnedSessionsStore(
    (state) => state.pinnedSessionIds,
  )

  const sortedSessions =
    sessions?.sort(
      (a: Session, b: Session) => b.time.updated - a.time.updated,
    ) || []

  const pinnedSessions = sortedSessions.filter((session) =>
    pinnedSessionIds.includes(session.id),
  )

  if (pinnedSessions.length === 0) {
    return null
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Pinned</SidebarGroupLabel>
      <SidebarGroupContent>
        <div className="space-y-1 p-2">
          {pinnedSessions.map((session: Session) => (
            <SessionItem key={session.id} session={session} />
          ))}
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
