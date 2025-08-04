import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"

import type { Session } from "@/server/routers/session/types"
import { ChatInputBox } from "@/app/components/chat-input-box"
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

        <ChatInputBox
          className="w-full max-w-2xl"
          onSend={handleSendMessage}
          disabled={isLoading}
          value={message}
          onChange={setMessage}
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
        className="bg-muted text-muted-foreground rounded px-2 py-1 font-mono
          text-xs"
      >
        {formatKeybindForDisplay(keybind)}
      </kbd>
    </div>
  )
}
