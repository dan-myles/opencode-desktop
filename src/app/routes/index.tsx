import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { Send } from "lucide-react"

import type { Session } from "@/server/routers/session/types"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { api } from "../lib/api"
import { formatKeybindForDisplay, getCurrentPlatform } from "../lib/utils"

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const createSession = useMutation(
    api.session.create.mutationOptions({
      onSuccess: async (session: Session) => {
        queryClient.invalidateQueries(api.session.list.queryOptions())

        if (message.trim()) {
          await chatMutation.mutateAsync({
            id: session.id,
            providerID: "anthropic",
            modelID: "claude-3-5-sonnet-20241022",
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

  const handleSendMessage = () => {
    if (!message.trim()) return
    createSession.mutate()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
          </div>
        </div>

        <div
          className="bg-background/20 relative rounded-xl border shadow-2xl
            backdrop-blur-md"
        >
          <div className="p-6">
            <div className="flex gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="bg-background/50 border-border/50 flex-1
                  backdrop-blur-sm"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isLoading}
                size="icon"
                className="bg-primary/90 hover:bg-primary"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
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
