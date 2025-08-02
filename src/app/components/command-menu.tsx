import { type Dispatch, type SetStateAction, useCallback, useState } from "react"

import { useKeybindList } from "../hooks/use-keybind"
import { useRegisterKeybind } from "../hooks/useRegisterKeybind"
import { formatKeybindForDisplay, getCurrentPlatform } from "../lib/utils"
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
    keys: {
      darwin: "cmd+k",
      win32: "ctrl+k",
      linux: "ctrl+k",
    },
    description: "Toggle command menu",
    callback: useCallback(() => setOpen((open) => !open), [setOpen]),
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
  setOpen: Dispatch<SetStateAction<boolean>>
}

function KeybindCommands({ setOpen }: CommandItemsProps) {
  const keybinds = useKeybindList()
  const platform = getCurrentPlatform()

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
            {platform === "linux"
              ? formatKeybindForDisplay(keybind.keys.linux!)
              : platform === "win32"
                ? formatKeybindForDisplay(keybind.keys.win32!)
                : platform === "darwin"
                  ? formatKeybindForDisplay(keybind.keys.darwin!)
                  : null}
          </CommandShortcut>
        </CommandItem>
      ))}
    </CommandGroup>
  )
}
