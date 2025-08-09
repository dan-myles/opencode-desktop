import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { Button } from "@/app/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { useLiveMessages } from "@/app/hooks/use-live-messages"
import { api } from "@/app/lib/api"

export const Route = createFileRoute("/dev/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [message, setMessage] = useState("")
  const [sessionId] = useState("ses_7759d17c3ffe3LIx1ObTCdr73w")

  const { messages, latestEvent } = useLiveMessages(sessionId)

  const chatMutation = useMutation(api.session.chat.mutationOptions())
  const createSessionMutation = useMutation(
    api.session.create.mutationOptions(),
  )

  const handleSendMessage = () => {
    if (!message.trim()) return

    chatMutation.mutate({
      id: sessionId,
      providerID: "anthropic",
      modelID: "claude-3-5-sonnet-20241022",
      parts: [
        {
          type: "text" as const,
          text: message.trim(),
        },
      ],
    })
    setMessage("")
  }

  const handleCreateSession = () => {
    createSessionMutation.mutate()
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">useLiveMessages Test</h1>
        <div className="flex items-center gap-2">
          <div
            className={`h-3 w-3 rounded-full
              ${latestEvent ? "bg-green-500" : "bg-red-500"}`}
          />
          <span className="text-sm">
            {latestEvent ? "Live Events Active" : "No Events"}
          </span>
        </div>
        <div className="text-muted-foreground text-sm">
          {messages.length} messages loaded
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Send Chat Message</label>
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={chatMutation.isPending || !message.trim()}
                >
                  Send
                </Button>
              </div>
              <p className="text-muted-foreground text-xs">
                Session ID: {sessionId}
              </p>
            </div>

            <Button
              onClick={handleCreateSession}
              disabled={createSessionMutation.isPending}
              variant="outline"
              className="w-full"
            >
              Create New Session
            </Button>

            {(chatMutation.error || createSessionMutation.error) && (
              <div className="rounded bg-red-50 p-2 text-sm text-red-600">
                Error:{" "}
                {chatMutation.error?.message ||
                  createSessionMutation.error?.message}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest Event</CardTitle>
          </CardHeader>
          <CardContent>
            {latestEvent ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{latestEvent.type}</span>
                  <span className="text-muted-foreground text-xs">
                    {new Date().toLocaleTimeString()}
                  </span>
                </div>
                <pre
                  className="bg-muted max-h-32 overflow-auto rounded p-2
                    text-xs"
                >
                  {JSON.stringify(latestEvent, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="text-muted-foreground text-sm">
                No events received yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Streaming Messages ({messages.length}) - Live Updates Only
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 space-y-3 overflow-auto">
            <div
              className="text-muted-foreground mb-3 rounded bg-yellow-50 p-2
                text-xs"
            >
              📡 Only showing messages that come in via live events (not initial
              load)
            </div>
            {messages.length > 0 ? (
              [...messages].reverse().map((message) => (
                <div
                  key={message.info.id}
                  className="rounded border border-green-200 bg-green-50 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-green-800 capitalize">
                      {message.info.role}
                    </span>
                    <span className="font-mono text-xs text-green-600">
                      LIVE:{" "}
                      {new Date(
                        message.info.time.created * 1000,
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="mb-1 font-mono text-xs text-green-700">
                      ID: {message.info.id}
                    </div>
                    <div className="text-green-600">
                      Parts: {message.parts.length} (will be populated by part
                      events)
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-muted-foreground p-8 text-center">
                <div className="mb-2 text-lg">
                  🎯 Waiting for live messages...
                </div>
                <div className="text-sm">
                  Send a message above to see it stream in here!
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
