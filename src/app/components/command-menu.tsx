import { useState } from "react"

import { useRegisterKeybind } from "@/app/hooks/use-register-keybind"
import { formatKeybindForDisplay } from "@/app/lib/utils"
import { useKeybindList } from "@/app/stores/keybind/store"
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
    id: "toggle-command-menu",
    key: "ctrl+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: "win32",
  })

  useRegisterKeybind({
    id: "toggle-command-menu",
    key: "cmd+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: "darwin",
  })

  useRegisterKeybind({
    id: "toggle-command-menu",
    key: "ctrl+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
    platform: "linux",
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
