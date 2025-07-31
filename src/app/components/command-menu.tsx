import { useState } from "react"

import { useRegisterKeybind } from "@/app/hooks/use-register-keybind"
import { formatKeybindForDisplay } from "@/app/lib/utils"
import { useKeybindList } from "@/app/stores/keybind/store"
import { Platform } from "@/app/stores/keybind/types"
import {
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command"

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  useRegisterKeybind({
    id: "toggle-command-menu-win32",
    key: "ctrl+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: Platform.WIN32,
  })

  useRegisterKeybind({
    id: "toggle-command-menu-darwin",
    key: "cmd+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: Platform.DARWIN,
  })

  useRegisterKeybind({
    id: "toggle-command-menu-linux",
    key: "ctrl+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: Platform.LINUX,
  })

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItems />
      </CommandList>
    </CommandDialog>
  )
}

function CommandItems() {
  const keybinds = useKeybindList()

  return (
    <>
      {keybinds.map((keybind) => (
        <CommandItem
          key={keybind.id}
          onSelect={() => {
            keybind.callback()
          }}
        >
          <span>{keybind.description}</span>
          <CommandShortcut>
            {formatKeybindForDisplay(keybind.key)}
          </CommandShortcut>
        </CommandItem>
      ))}
    </>
  )
}
