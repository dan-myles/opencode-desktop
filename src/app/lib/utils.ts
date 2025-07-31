import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKeybindForDisplay(key: string): string {
  return key
    .split('+')
    .map(part => {
      switch (part.toLowerCase()) {
        case 'ctrl': return '⌃'
        case 'cmd': return '⌘'
        case 'alt': return '⌥'
        case 'shift': return '⇧'
        case 'enter': return '↵'
        case 'escape': return '⎋'
        case 'space': return '␣'
        case 'tab': return '⇥'
        case 'backspace': return '⌫'
        case 'delete': return '⌦'
        case 'arrowup': return '↑'
        case 'arrowdown': return '↓'
        case 'arrowleft': return '←'
        case 'arrowright': return '→'
        default: return part.toUpperCase()
      }
    })
    .join('')
}
