import { Suspense } from "react"
import { createFileRoute } from "@tanstack/react-router"

import { ChatInputBox } from "@/app/components/chat-input-box"
import { useLiveMessages } from "@/app/hooks/use-live-messages"
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
  const { messages, sendMessage } = useLiveMessages(sessionId)

  return (
    <div className="relative h-full max-w-full">
      {/* Floating header */}
      <SessionHeader sessionId={sessionId} />

      {/* Chat messages background */}
      <div className="absolute inset-0">
        <Suspense>
          <VirtualizedChatMessages messages={messages} />
        </Suspense>
      </div>

      {/* Floating bottom-docked chatbox */}
      <div
        className="pointer-events-none absolute right-0 bottom-0 left-0 flex
          justify-center p-6 pb-10"
      >
        <ChatInputBox
          className="pointer-events-auto relative w-full max-w-2xl"
          sessionId={sessionId}
          onSendMessage={sendMessage}
          placeholder="Type your message..."
          autoFocus
        />
      </div>
    </div>
  )
}
