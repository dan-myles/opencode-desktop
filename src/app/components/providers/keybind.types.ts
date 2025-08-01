export type KeybindId =
  | "toggle-sidebar"
  | "toggle-command-menu"
  | "toggle-light-dark-mode"
  | "navigate-settings"

type Modifier = "ctrl" | "cmd" | "alt" | "shift"

type Letter =
  | "a"
  | "b"
  | "c"
  | "d"
  | "e"
  | "f"
  | "g"
  | "h"
  | "i"
  | "j"
  | "k"
  | "l"
  | "m"
  | "n"
  | "o"
  | "p"
  | "q"
  | "r"
  | "s"
  | "t"
  | "u"
  | "v"
  | "w"
  | "x"
  | "y"
  | "z"

type Number = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"

type FunctionKey =
  | "f1"
  | "f2"
  | "f3"
  | "f4"
  | "f5"
  | "f6"
  | "f7"
  | "f8"
  | "f9"
  | "f10"
  | "f11"
  | "f12"

type SpecialKey =
  | "escape"
  | "enter"
  | "space"
  | "tab"
  | "backspace"
  | "delete"
  | "arrowup"
  | "arrowdown"
  | "arrowleft"
  | "arrowright"

type Symbol = "," | "." | "/" | ";" | "'" | "[" | "]" | "\\" | "`" | "-" | "="

type Key = Letter | Number | FunctionKey | SpecialKey | Symbol

export type KeybindString =
  | Key
  | `${Modifier}+${Key}`
  | `${Modifier}+${Modifier}+${Key}`
  | `${Modifier}+${Modifier}+${Modifier}+${Key}`

export type Platform = "darwin" | "win32" | "linux"

export interface KeybindDefinition {
  id: KeybindId
  keys: {
    darwin?: KeybindString
    win32?: KeybindString
    linux?: KeybindString
  }
  description: string
  override?: boolean
}

export interface Keybind extends KeybindDefinition {
  callback: () => void
}
