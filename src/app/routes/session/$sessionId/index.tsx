import { useSuspenseQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"

import { ChatInputBox } from "@/app/components/chat-input-box"
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
          justify-center p-6 pb-10"
      >
        <ChatInputBox className="pointer-events-auto relative w-full max-w-2xl" />
      </div>
    </div>
  )
}
