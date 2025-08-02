import { useCallback, useEffect, useMemo, useRef } from "react"
import { useQuery } from "@tanstack/react-query"
import { useNavigate, useParams, useRouter } from "@tanstack/react-router"

import type { Session } from "@/server/routers/session/types"
import { api } from "@/app/lib/api"
import { debounce } from "@/app/lib/utils"

export function useSessionNavigation() {
  const navigate = useNavigate()
  const router = useRouter()
  const params = useParams({ strict: false })
  const currentSessionId = params.sessionId

  const { data: sessions } = useQuery(api.session.list.queryOptions())

  const sortedSessions = useMemo(
    () =>
      (sessions as Session[] | undefined)?.sort(
        (a: Session, b: Session) => b.time.updated - a.time.updated,
      ) || [],
    [sessions],
  )

  // Track preloaded sessions to avoid duplicate preloading
  const preloadedSessions = useRef(new Set<string>())

  // Debounced preloading to avoid excessive requests
  const debouncedPreload = useMemo(
    () =>
      debounce(async (sessionIds: string[]) => {
        const unpreloadedIds = sessionIds.filter(
          (id) => !preloadedSessions.current.has(id),
        )

        if (unpreloadedIds.length === 0) return

        try {
          await Promise.allSettled(
            unpreloadedIds.map(async (sessionId) => {
              await router.preloadRoute({
                to: "/session/$sessionId",
                params: { sessionId },
              })
              preloadedSessions.current.add(sessionId)
            }),
          )
        } catch (error) {
          console.warn("Failed to preload sessions:", error)
        }
      }, 150),
    [router],
  )

  // Intelligent preloading based on navigation patterns
  const preloadAdjacentSessions = useCallback(async () => {
    if (!currentSessionId || sortedSessions.length === 0) return

    const currentIndex = sortedSessions.findIndex(
      (session) => session.id === currentSessionId,
    )

    if (currentIndex === -1) return

    // Calculate adjacent session indices with wrap-around
    const adjacentIndices = [
      currentIndex === 0 ? sortedSessions.length - 1 : currentIndex - 1, // Previous
      currentIndex === sortedSessions.length - 1 ? 0 : currentIndex + 1, // Next
    ]

    // Also preload sessions 2 positions away for faster sequential navigation
    const extendedIndices = [
      (currentIndex - 2 + sortedSessions.length) % sortedSessions.length,
      (currentIndex + 2) % sortedSessions.length,
    ]

    const sessionIdsToPreload = [...adjacentIndices, ...extendedIndices]
      .map((index) => sortedSessions[index]?.id)
      .filter(Boolean)

    debouncedPreload(sessionIdsToPreload)
  }, [sortedSessions, currentSessionId, debouncedPreload])

  // Enhanced navigation with guaranteed preloading
  const navigateToSession = useCallback(
    async (sessionId: string) => {
      // Ensure target session is preloaded before navigation
      if (!preloadedSessions.current.has(sessionId)) {
        try {
          await router.preloadRoute({
            to: "/session/$sessionId",
            params: { sessionId },
          })
          preloadedSessions.current.add(sessionId)
        } catch (error) {
          console.warn(`Failed to preload session ${sessionId}:`, error)
          // Continue with navigation even if preload fails
        }
      }

      navigate({
        to: "/session/$sessionId",
        params: { sessionId },
        viewTransition: true,
      })
    },
    [navigate, router],
  )

  const navigateToPreviousSession = useCallback(async () => {
    if (sortedSessions.length === 0) return

    if (!currentSessionId) {
      await navigateToSession(sortedSessions[0].id)
      return
    }

    const currentIndex = sortedSessions.findIndex(
      (session) => session.id === currentSessionId,
    )

    if (currentIndex === -1) {
      await navigateToSession(sortedSessions[0].id)
      return
    }

    const previousIndex =
      currentIndex === 0 ? sortedSessions.length - 1 : currentIndex - 1
    const targetSessionId = sortedSessions[previousIndex].id

    // Preload the session after the target (for continued backward navigation)
    const nextPreviousIndex =
      previousIndex === 0 ? sortedSessions.length - 1 : previousIndex - 1
    debouncedPreload([sortedSessions[nextPreviousIndex].id])

    await navigateToSession(targetSessionId)
  }, [sortedSessions, currentSessionId, navigateToSession, debouncedPreload])

  const navigateToNextSession = useCallback(async () => {
    if (sortedSessions.length === 0) return

    if (!currentSessionId) {
      await navigateToSession(sortedSessions[0].id)
      return
    }

    const currentIndex = sortedSessions.findIndex(
      (session) => session.id === currentSessionId,
    )

    if (currentIndex === -1) {
      await navigateToSession(sortedSessions[0].id)
      return
    }

    const nextIndex =
      currentIndex === sortedSessions.length - 1 ? 0 : currentIndex + 1
    const targetSessionId = sortedSessions[nextIndex].id

    // Preload the session after the target (for continued forward navigation)
    const nextNextIndex =
      nextIndex === sortedSessions.length - 1 ? 0 : nextIndex + 1
    debouncedPreload([sortedSessions[nextNextIndex].id])

    await navigateToSession(targetSessionId)
  }, [sortedSessions, currentSessionId, navigateToSession, debouncedPreload])

  // Auto-preload adjacent sessions when current session changes
  useEffect(() => {
    preloadAdjacentSessions()
  }, [preloadAdjacentSessions])

  // Cleanup preload cache when sessions list changes
  useEffect(() => {
    const currentSessionIds = new Set(sortedSessions.map((s) => s.id))
    const preloadedIds = Array.from(preloadedSessions.current)

    // Remove preloaded sessions that no longer exist
    preloadedIds.forEach((id) => {
      if (!currentSessionIds.has(id)) {
        preloadedSessions.current.delete(id)
      }
    })
  }, [sortedSessions])

  return {
    navigateToPreviousSession,
    navigateToNextSession,
    navigateToSession,
    currentSessionId,
    sessionsCount: sortedSessions.length,
    preloadAdjacentSessions,
    getPreloadedSessions: () => Array.from(preloadedSessions.current),
  } as const
}
