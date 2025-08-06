import { useMemo } from "react"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { ChatMessageAssistant } from "./chat-message-assistant"
import { ChatMessageUser } from "./chat-message-user"

interface ChatMessageProps {
  message: { info: Message; parts: Part[] }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const formattedTime = useMemo(
    () => new Date(message.info.time.created * 1000).toLocaleTimeString(),
    [message.info.time.created],
  )

  const modelInfo = useMemo(() => {
    if (message.info.role === "assistant") {
      const assistantMessage = message.info
      return `${assistantMessage.providerID}/${assistantMessage.modelID}`
    }
    return null
  }, [message.info])

  return message.info.role === "user" ? (
    <ChatMessageUser message={message} formattedTime={formattedTime} />
  ) : (
    <ChatMessageAssistant
      message={message}
      formattedTime={formattedTime}
      modelInfo={modelInfo}
    />
  )
}
