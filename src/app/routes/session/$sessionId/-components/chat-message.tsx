import { memo, useMemo } from "react"

import type { MessageWithParts } from "@/server/routers/session/types"
import { ChatMessageAssistant } from "./chat-message-assistant"
import { ChatMessageUser } from "./chat-message-user"

interface ChatMessageProps {
  message: MessageWithParts
}

export const ChatMessage = memo(
  ({ message }: ChatMessageProps) => {
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
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.info.id === nextProps.message.info.id &&
      prevProps.message.parts.length === nextProps.message.parts.length
    )
  },
)
