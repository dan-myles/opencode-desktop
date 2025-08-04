import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Send } from "lucide-react"

import type { AssistantMessage } from "@/server/routers/session/types"
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

  const latestAssistantMessage = session
    ?.filter((msg) => msg.info.role === "assistant")
    ?.at(-1)

  const currentModel =
    latestAssistantMessage?.info.role === "assistant"
      ? (latestAssistantMessage.info as AssistantMessage)
      : null

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
          justify-center p-6 pb-10"
      >
        <div className="pointer-events-auto relative w-full max-w-2xl">
          {/* Backdrop blur container */}
          <div
            className="bg-background/80 relative rounded-xl border shadow-2xl
              backdrop-blur-md"
          >
            {/* Chat input area */}
            <div className="p-6">
              <div className="flex gap-3">
                <Input
                  placeholder="Type your message..."
                  className="bg-background border-border flex-1"
                />
                <Button size="icon" className="bg-primary hover:bg-primary/90">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Floating model indicator */}
          {currentModel?.providerID && currentModel?.modelID && (
            <div className="pointer-events-auto absolute top-full right-4 -mt-3">
              <div
                className="bg-background/80 border-border text-muted-foreground
                  rounded-full border px-3 py-1.5 shadow-lg backdrop-blur-md"
              >
                <span className="font-mono text-xs">
                  {currentModel.providerID}/{currentModel.modelID}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
