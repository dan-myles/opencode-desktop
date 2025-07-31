import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import { Platform } from "@/app/stores/keybind/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKeybindForDisplay(key: string): string {
  return key
    .split("+")
    .map((part) => {
      switch (part.toLowerCase()) {
        case "ctrl":
          return "⌃"
        case "cmd":
          return "⌘"
        case "alt":
          return "⌥"
        case "shift":
          return "⇧"
        case "enter":
          return "↵"
        case "escape":
          return "⎋"
        case "space":
          return "␣"
        case "tab":
          return "⇥"
        case "backspace":
          return "⌫"
        case "delete":
          return "⌦"
        case "arrowup":
          return "↑"
        case "arrowdown":
          return "↓"
        case "arrowleft":
          return "←"
        case "arrowright":
          return "→"
        default:
          return part.toUpperCase()
      }
    })
    .join("")
}

export function getCurrentPlatform(): Platform {
  if (typeof __DARWIN__ !== "undefined" && __DARWIN__) return Platform.DARWIN
  if (typeof __WIN32__ !== "undefined" && __WIN32__) return Platform.WIN32
  if (typeof __LINUX__ !== "undefined" && __LINUX__) return Platform.LINUX

  if (typeof navigator !== "undefined") {
    const userAgent = navigator.userAgent.toLowerCase()
    if (userAgent.includes("mac")) return Platform.DARWIN
    if (userAgent.includes("win")) return Platform.WIN32
    return Platform.LINUX
  }

  return Platform.LINUX
}
