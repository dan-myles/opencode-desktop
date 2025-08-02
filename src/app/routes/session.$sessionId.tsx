import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { api } from "@/app/lib/api"

export const Route = createFileRoute("/session/$sessionId")({
  component: SessionPage,
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const {
    data: session,
    isLoading,
    error,
  } = useQuery(api.session.messages.queryOptions({ id: sessionId }))

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-lg font-semibold">Session not found</h2>
          <p className="text-muted-foreground">
            The session you're looking for doesn't exist or couldn't be loaded.
          </p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div
            className="border-primary mx-auto mb-4 h-8 w-8 animate-spin
              rounded-full border-b-2"
          ></div>
          <p className="text-muted-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full max-w-full flex-col">
      <div className="flex-1 p-4">
        {session && session.length > 0 ? (
          <div className="space-y-4">
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
          <div className="text-muted-foreground text-center">
            No messages in this session yet
          </div>
        )}
      </div>
    </div>
  )
}
