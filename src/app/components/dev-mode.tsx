"use no memo"

import { useCallback } from "react"
import { useNavigate } from "@tanstack/react-router"

import { useRegisterKeybind } from "../stores/keybind.store"

export function DevMode() {
  const navigate = useNavigate()

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line react-hooks/react-compiler
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useRegisterKeybind({
      id: "navigate-dev",
      keys: {
        darwin: "cmd+/",
        win32: "ctrl+/",
        linux: "ctrl+/",
      },
      // eslint-disable-next-line react-hooks/react-compiler
      // eslint-disable-next-line react-hooks/rules-of-hooks
      callback: useCallback(
        () => navigate({ to: "/dev", viewTransition: true }),
        [navigate],
      ),
      description: "Open dev route",
    })
  }

  return null
}
