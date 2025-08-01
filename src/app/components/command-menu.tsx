import { Dispatch, SetStateAction, useState } from "react"

import { useRegisterKeybind } from "@/app/hooks/use-register-keybind"
import { formatKeybindForDisplay } from "@/app/lib/utils"
import { useKeybindList } from "@/app/stores/keybind/store"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "./ui/command"

export function CommandMenu() {
  const [open, setOpen] = useState(false)

  useRegisterKeybind({
    id: "toggle-command-menu",
    darwinKey: "cmd+k",
    win32Key: "ctrl+k",
    linuxKey: "ctrl+k",
    description: "Toggle command menu",
    callback: () => setOpen((open) => !open),
  })

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <KeybindCommands setOpen={setOpen} />
      </CommandList>
    </CommandDialog>
  )
}

interface CommandItemsProps {
  setOpen: Dispatch<SetStateAction<Boolean>>
}

function KeybindCommands({ setOpen }: CommandItemsProps) {
  const keybinds = useKeybindList()

  return (
    <CommandGroup heading="Commands">
      {keybinds.map((keybind) => (
        <CommandItem
          key={keybind.id}
          onSelect={() => {
            keybind.callback()
            setOpen(false)
          }}
        >
          <span>{keybind.description}</span>
          <CommandShortcut>
            {formatKeybindForDisplay(keybind.key)}
          </CommandShortcut>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
