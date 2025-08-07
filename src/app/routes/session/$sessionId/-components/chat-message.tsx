import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { ChatMessageAssistant } from "./chat-message-assistant"
import { ChatMessageUser } from "./chat-message-user"

interface ChatMessageProps {
  message: { info: Message; parts: Part[] }
}

export function ChatMessage({ message }: ChatMessageProps) {
  return message.info.role === "user" ? (
    <ChatMessageUser message={message} />
  ) : (
    <ChatMessageAssistant message={message} />
  )
}
