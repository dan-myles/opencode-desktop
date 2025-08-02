import { useCallback } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams } from "@tanstack/react-router"

import type { Session } from "@/server/routers/session/types"
import { api } from "@/app/lib/api"

export function useSessionNavigation() {
  const navigate = useNavigate()
  const params = useParams({ strict: false })
  const currentSessionId = params.sessionId

  const { data: sessions } = useQuery(api.session.list.queryOptions())

  const sortedSessions =
    sessions?.sort(
      (a: Session, b: Session) => b.time.updated - a.time.updated,
    ) || []

  const navigateToSession = useCallback(
    (sessionId: string) => {
      navigate({
        to: "/session/$sessionId",
        params: { sessionId },
        viewTransition: true,
      })
    },
    [navigate],
  )

  const navigateToPreviousSession = useCallback(() => {
    if (sortedSessions.length === 0) return

    if (!currentSessionId) {
      // If no current session, go to the most recent one
      navigateToSession(sortedSessions[0].id)
      return
    }

    const currentIndex = sortedSessions.findIndex(
      (session) => session.id === currentSessionId,
    )

    if (currentIndex === -1) {
      // Current session not found, go to most recent
      navigateToSession(sortedSessions[0].id)
      return
    }

    // Go to previous session (wrap around to end if at beginning)
    const previousIndex =
      currentIndex === 0 ? sortedSessions.length - 1 : currentIndex - 1
    navigateToSession(sortedSessions[previousIndex].id)
  }, [sortedSessions, currentSessionId, navigateToSession])

  const navigateToNextSession = useCallback(() => {
    if (sortedSessions.length === 0) return

    if (!currentSessionId) {
      // If no current session, go to the most recent one
      navigateToSession(sortedSessions[0].id)
      return
    }

    const currentIndex = sortedSessions.findIndex(
      (session) => session.id === currentSessionId,
    )

    if (currentIndex === -1) {
      // Current session not found, go to most recent
      navigateToSession(sortedSessions[0].id)
      return
    }

    // Go to next session (wrap around to beginning if at end)
    const nextIndex =
      currentIndex === sortedSessions.length - 1 ? 0 : currentIndex + 1
    navigateToSession(sortedSessions[nextIndex].id)
  }, [sortedSessions, currentSessionId, navigateToSession])

  return {
    navigateToPreviousSession,
    navigateToNextSession,
    currentSessionId,
    sessionsCount: sortedSessions.length,
  }
}
