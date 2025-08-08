import { createFileRoute } from "@tanstack/react-router"

import { ChatInputBox } from "@/app/components/chat-input-box"
import { formatKeybindForDisplay, getCurrentPlatform } from "../lib/utils"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-6xl font-bold tracking-tight">
            OPENCODE
          </h1>
          <div
            className="text-muted-foreground flex flex-col flex-wrap
              items-center justify-center gap-x-6 gap-y-2 text-sm sm:flex-row"
          >
            <KeybindHint
              description="New session"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+n" : "ctrl+n"}
            />
            <KeybindHint
              description="Next session"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+n" : "ctrl+n"}
            />
            <KeybindHint
              description="Change model"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+l" : "ctrl+l"}
            />
          </div>
        </div>
        <ChatInputBox
          className="w-full max-w-2xl"
          placeholder="Start a new conversation..."
          autoFocus
        />
      </div>
    </div>
  )
}

function KeybindHint({
  description,
  keybind,
}: {
  description: string
  keybind: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span>{description}</span>
      <kbd
        className="bg-muted text-muted-foreground rounded px-1.5 py-0.5
          font-mono text-xs"
      >
        {formatKeybindForDisplay(keybind)}
      </kbd>
    </div>
  )
}
