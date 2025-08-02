import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
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
