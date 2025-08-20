import { useMutation } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { ChatInputBox } from "@/app/components/chat-input-box"
import { api } from "@/app/lib/api"
import { useModeStore } from "@/app/stores/mode.store"
import { useModelStore } from "@/app/stores/model.store"
import { formatKeybindForDisplay, getCurrentPlatform } from "../lib/utils"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const navigate = useNavigate()
  const currentModel = useModelStore((state) => state.currentModel)
  const currentMode = useModeStore((state) => state.currentMode)

  const createSession = useMutation(api.session.create.mutationOptions())
  const sendMessage = useMutation(api.session.chat.mutationOptions())

  const handleSendMessage = async (text: string) => {
    if (!currentModel) {
      throw new Error("No model selected. Please select a model first.")
    }

    // Create new session
    const session = await createSession.mutateAsync()

    if (!session) {
      throw new Error("Failed to create session")
    }

    // Send first message
    await sendMessage.mutateAsync({
      id: session.id,
      providerID: currentModel.providerID,
      modelID: currentModel.modelID,
      agent: currentMode || undefined,
      parts: [{ type: "text" as const, text }],
    })

    // Navigate to the new session with view transition
    navigate({
      to: "/session/$sessionId",
      params: { sessionId: session.id },
      viewTransition: true,
    })
  }

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
          sessionId="temp"
          onSendMessage={handleSendMessage}
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
