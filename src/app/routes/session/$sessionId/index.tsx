import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Send } from "lucide-react"

import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { api } from "@/app/lib/api"
import { VirtualizedChatMessages } from "./-components/virtualized-chat-messages"

export const Route = createFileRoute("/session/$sessionId/")({
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
      {/* Messages area - virtualized */}
      <VirtualizedChatMessages messages={session || []} />

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
