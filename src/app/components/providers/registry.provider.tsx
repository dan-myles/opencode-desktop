import type { ReactNode } from "react"
import { useCallback } from "react"
import { useNavigate, useRouterState } from "@tanstack/react-router"

import { useRegisterKeybind } from "@/app/stores/keybind.store"
import { usePinnedSessionsStore } from "@/app/stores/pinned-sessions.store"

/**
 * Registry Provider
 *
 * This is where we register all keybinds that are not local to a component,
 * so navigation etc. This happens because we need a way to register keybinds,
 * for a component that isn't mounted yet
 **/
export function RegistryProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const routerState = useRouterState()
  const { togglePin, getPinnedSessionAtIndex } = usePinnedSessionsStore()

  useRegisterKeybind({
    id: "navigate-settings",
    keys: {
      darwin: "cmd+,",
      win32: "ctrl+,",
      linux: "ctrl+,",
    },
    callback: useCallback(
      () => navigate({ to: "/settings", viewTransition: true }),
      [navigate],
    ),
    description: "Open settings",
  })

  useRegisterKeybind({
    id: "navigate-home",
    keys: {
      darwin: "cmd+o",
      win32: "ctrl+o",
      linux: "ctrl+o",
    },
    description: "New session",
    callback: useCallback(
      () => navigate({ to: "/", viewTransition: true }),
      [navigate],
    ),
  })

  useRegisterKeybind({
    id: "toggle-pin-session",
    keys: {
      darwin: "cmd+i",
      win32: "ctrl+i",
      linux: "ctrl+i",
    },
    description: "Pin/unpin current session",
    callback: useCallback(() => {
      const currentLocation = routerState.location
      const sessionMatch =
        currentLocation.pathname.match(/^\/session\/([^\/]+)/)

      if (sessionMatch) {
        const sessionId = sessionMatch[1]
        togglePin(sessionId)
      }
    }, [routerState.location, togglePin]),
  })

  useRegisterKeybind({
    id: "navigate-pinned-session-1",
    keys: {
      darwin: "cmd+1",
      win32: "ctrl+1",
      linux: "ctrl+1",
    },
    description: "Navigate to pinned session 1",
    callback: useCallback(() => {
      const sessionId = getPinnedSessionAtIndex(0)
      if (sessionId) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId },
          viewTransition: true,
        })
      }
    }, [getPinnedSessionAtIndex, navigate]),
  })

  useRegisterKeybind({
    id: "navigate-pinned-session-2",
    keys: {
      darwin: "cmd+2",
      win32: "ctrl+2",
      linux: "ctrl+2",
    },
    description: "Navigate to pinned session 2",
    callback: useCallback(() => {
      const sessionId = getPinnedSessionAtIndex(1)
      if (sessionId) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId },
          viewTransition: true,
        })
      }
    }, [getPinnedSessionAtIndex, navigate]),
  })

  useRegisterKeybind({
    id: "navigate-pinned-session-3",
    keys: {
      darwin: "cmd+3",
      win32: "ctrl+3",
      linux: "ctrl+3",
    },
    description: "Navigate to pinned session 3",
    callback: useCallback(() => {
      const sessionId = getPinnedSessionAtIndex(2)
      if (sessionId) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId },
          viewTransition: true,
        })
      }
    }, [getPinnedSessionAtIndex, navigate]),
  })

  useRegisterKeybind({
    id: "navigate-pinned-session-4",
    keys: {
      darwin: "cmd+4",
      win32: "ctrl+4",
      linux: "ctrl+4",
    },
    description: "Navigate to pinned session 4",
    callback: useCallback(() => {
      const sessionId = getPinnedSessionAtIndex(3)
      if (sessionId) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId },
          viewTransition: true,
        })
      }
    }, [getPinnedSessionAtIndex, navigate]),
  })

  useRegisterKeybind({
    id: "navigate-pinned-session-5",
    keys: {
      darwin: "cmd+5",
      win32: "ctrl+5",
      linux: "ctrl+5",
    },
    description: "Navigate to pinned session 5",
    callback: useCallback(() => {
      const sessionId = getPinnedSessionAtIndex(4)
      if (sessionId) {
        navigate({
          to: "/session/$sessionId",
          params: { sessionId },
          viewTransition: true,
        })
      }
    }, [getPinnedSessionAtIndex, navigate]),
  })

  return <>{children}</>
}
