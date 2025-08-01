import { useEffect } from "react"

import type { Keybind, KeybindString } from "@/app/stores/keybind/types"
import { useRegisterKeybind as useRK } from "@/app/stores/keybind/store"

type UseRegisterKeybindParams = Omit<Keybind, "platform" | "key"> & {
  win32Key?: KeybindString
  darwinKey?: KeybindString
  linuxKey?: KeybindString
}

export function useRegisterKeybind(params: UseRegisterKeybindParams) {
  const register = useRK()

  useEffect(() => {
    if (params.linuxKey) {
      register({
        id: params.id,
        callback: params.callback,
        description: params.description,
        key: params.linuxKey,
        platform: "linux",
      })
    }

    if (params.win32Key) {
      register({
        id: params.id,
        callback: params.callback,
        description: params.description,
        key: params.win32Key,
        platform: "win32",
      })
    }

    if (params.darwinKey) {
      register({
        id: params.id,
        callback: params.callback,
        description: params.description,
        key: params.darwinKey,
        platform: "darwin",
      })
    }
  }, [params])
}
