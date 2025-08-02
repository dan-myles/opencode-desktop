import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Send } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { api } from "@/app/lib/api"
import { SessionHeader } from "./-components/session-header"
import { VirtualizedChatMessages } from "./-components/virtualized-chat-messages"

export const Route = createFileRoute("/session/$sessionId/")({
  component: SessionPage,
  loader: async ({ context: { api, queryClient }, params }) => {
    queryClient.prefetchQuery(
      api.session.messages.queryOptions({ id: params.sessionId }),
    )
    queryClient.prefetchQuery(
      api.session.get.queryOptions({ id: params.sessionId }),
    )
  },
})

function SessionPage() {
  const { sessionId } = Route.useParams()
  const { data: session } = useSuspenseQuery(
    api.session.messages.queryOptions({ id: sessionId }),
  )

  return (
    <div className="relative h-full max-w-full">
      {/* Floating header */}
      <SessionHeader sessionId={sessionId} />

      {/* Chat messages background */}
      <div className="absolute inset-0">
        <VirtualizedChatMessages messages={session || []} />
      </div>

      {/* Floating bottom-docked chatbox */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 flex
          justify-center p-6"
      >
        <div className="pointer-events-auto w-full max-w-2xl">
          {/* Backdrop blur container */}
          <div
            className="bg-background/20 relative rounded-xl border shadow-2xl
              backdrop-blur-md"
          >
            {/* Chat input area */}
            <div className="p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  className="bg-background/50 border-border/50 flex-1
                    backdrop-blur-sm"
                  disabled
                />
                <Button
                  size="icon"
                  disabled
                  className="bg-primary/90 hover:bg-primary"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
