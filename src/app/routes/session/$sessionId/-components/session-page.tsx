import { ChatInputBox } from "@/app/components/chat-input-box"
import { useLiveMessages } from "@/app/hooks/use-live-messages"
import { Conversation } from "./conversation"
import { SessionHeader } from "./session-header"

interface SessionPageProps {
  sessionId: string
}

export function SessionPage({ sessionId }: SessionPageProps) {
  const { messages, sendMessage } = useLiveMessages(sessionId)

  return (
    <div className="relative h-full max-w-full">
      {/* Floating header */}
      <SessionHeader sessionId={sessionId} />

      {/* Chat messages background */}
      <div className="absolute inset-0">
        <Conversation messages={messages} />
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

