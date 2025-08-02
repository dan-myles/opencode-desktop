import type { ReactNode } from "react"
import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"

import { useRegisterKeybind } from "@/app/hooks/use-keybind"

/**
 * Registry Provider
 *
 * This is where we register all keybinds that are not local to a component,
 * so navigation etc. This happens because we need a way to register keybinds,
 * for a component that isn't mounted yet
 **/
export function RegistryProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

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

  return <>{children}</>
}
