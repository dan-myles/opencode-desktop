import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Send } from "lucide-react"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { api } from "../lib/api"

export const Route = createFileRoute("/session/$sessionId")({
  component: SessionPage,
  loader: async ({ context: { api, queryClient }, params }) => {
    queryClient.prefetchQuery(
      api.session.messages.queryOptions({ id: params.sessionId }),
    )
  },
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const { data: session } = useSuspenseQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )

  return (
    <div className="flex h-full max-w-full flex-col">
      {/* Messages area - scrollable */}
      <div className="flex flex-1 flex-col-reverse overflow-y-auto">
        <div className="p-4">
          {session && session.length > 0 ? (
            <div className="flex flex-col-reverse space-y-4">
              {session.map((message: MessageWithParts) => (
                <div key={message.info.id} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-sm font-medium capitalize">
                      {message.info.role}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {new Date(
                        message.info.time.created * 1000,
                      ).toLocaleString()}
                    </span>
                  </div>

                  {message.parts.length > 0 && (
                    <div className="space-y-2">
                      {message.parts.map((part: Part) => (
                        <div key={part.id} className="text-sm">
                          <span
                            className="text-muted-foreground font-mono text-xs"
                          >
                            {part.type}:
                          </span>
                          <pre className="mt-1 whitespace-pre-wrap">
                            {JSON.stringify(part, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              No messages in this session yet. Start a conversation below!
            </div>
          )}
        </div>
      </div>

      {/* Chat input area - fixed at bottom */}
      <div className="bg-background border-t p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            className="flex-1"
            disabled
          />
          <Button size="icon" disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
