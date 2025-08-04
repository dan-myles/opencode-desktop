import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Settings } from "lucide-react"

import type { Session } from "@/server/routers/session/types"
import { ChatInputBox } from "@/app/components/chat-input-box"
import { Button } from "@/app/components/ui/button"
import { useModelStore } from "@/app/stores/model.store"
import { api } from "../lib/api"
import { formatKeybindForDisplay, getCurrentPlatform } from "../lib/utils"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const currentModel = useModelStore((state) => state.currentModel)
  const { data: providersData } = useQuery(api.config.providers.queryOptions())

  const getDefaultModel = () => {
    if (currentModel) return currentModel
    if (providersData?.default) {
      const firstProvider = Object.keys(providersData.default)[0]
      if (firstProvider) {
        return {
          providerID: firstProvider,
          modelID: providersData.default[firstProvider],
        }
      }
    }
    return { providerID: "anthropic", modelID: "claude-3-5-sonnet-20241022" }
  }

  const createSession = useMutation(
    api.session.create.mutationOptions({
      onSuccess: async (session: Session) => {
        queryClient.invalidateQueries(api.session.list.queryOptions())

        if (message.trim()) {
          const model = getDefaultModel()
          await chatMutation.mutateAsync({
            id: session.id,
            providerID: model.providerID,
            modelID: model.modelID,
            parts: [
              {
                type: "text" as const,
                text: message.trim(),
              },
            ],
          })
        }

        navigate({
          to: "/session/$sessionId",
          params: { sessionId: session.id },
        })
      },
    }),
  )

  const chatMutation = useMutation(api.session.chat.mutationOptions())

  const handleSendMessage = (messageText: string) => {
    setMessage(messageText)
    createSession.mutate()
  }

  const isLoading = createSession.isPending || chatMutation.isPending

  return (
    <div className="flex h-full items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="mb-12 text-center">
          <h1 className="text-foreground mb-4 text-6xl font-bold tracking-tight">
            OPENCODE
          </h1>
          <div
            className="text-muted-foreground flex flex-col flex-wrap
              items-center justify-center gap-4 text-sm"
          >
            <KeybindHint
              description="Command menu"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+k" : "ctrl+k"}
            />
            <KeybindHint
              description="Toggle sidebar"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+s" : "ctrl+s"}
            />
            <KeybindHint
              description="Settings"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+," : "ctrl+,"}
            />
            <KeybindHint
              description="Previous session"
              keybind={getCurrentPlatform() === "darwin" ? "cmd+p" : "ctrl+p"}
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

        <div className="relative">
          <ChatInputBox
            className="w-full max-w-2xl"
            onSend={handleSendMessage}
            disabled={isLoading}
            value={message}
            onChange={setMessage}
          />

          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const event = new KeyboardEvent("keydown", {
                  key: "l",
                  metaKey: getCurrentPlatform() === "darwin",
                  ctrlKey: getCurrentPlatform() !== "darwin",
                })
                document.dispatchEvent(event)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              <Settings className="mr-2 h-4 w-4" />
              Change Model
            </Button>
          </div>
        </div>
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
        className="bg-muted text-muted-foreground rounded px-2 py-1 font-mono
          text-xs"
      >
        {formatKeybindForDisplay(keybind)}
      </kbd>
    </div>
  )
}
