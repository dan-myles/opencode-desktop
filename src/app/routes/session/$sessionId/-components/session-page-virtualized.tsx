import { Suspense } from "react"

import { ChatInputBox } from "@/app/components/chat-input-box"
import { useLiveMessages } from "@/app/hooks/use-live-messages"
import { ConversationVirtualized } from "./conversation-virtualized"
import { SessionHeader } from "./session-header"

interface SessionPageVirtualizedProps {
  sessionId: string
}

export function SessionPageVirtualized({ sessionId }: SessionPageVirtualizedProps) {
  const { messages, sendMessage } = useLiveMessages(sessionId)

  return (
    <div className="relative h-full max-w-full">
      {/* Floating header */}
      <SessionHeader sessionId={sessionId} />

      {/* Chat messages background */}
      <div className="absolute inset-0">
        <Suspense>
          <ConversationVirtualized messages={messages} />
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