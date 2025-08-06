import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { MessagePart } from "./parts/message-part"

interface ChatMessageAssistantProps {
  message: { info: Message; parts: Part[] }
}

export function ChatMessageAssistant({ message }: ChatMessageAssistantProps) {
  return (
    <div className="w-full">
      <div className="mb-2 space-y-4">
        {message.parts.map((part) => (
          <div key={part.id} className="w-full">
            <MessagePart part={part} message={message.info} />
          </div>
        ))}
      </div>
    </div>
  )
}
