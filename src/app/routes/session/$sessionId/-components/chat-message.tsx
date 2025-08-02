import { memo, useMemo } from "react"

import type { MessageWithParts } from "@/server/routers/session/types"
import { MessagePart } from "./message-part"

interface ChatMessageProps {
  message: MessageWithParts
}

export const ChatMessage = memo(
  ({ message }: ChatMessageProps) => {
    const formattedTime = useMemo(
      () => new Date(message.info.time.created * 1000).toLocaleTimeString(),
      [message.info.time.created],
    )
    return (
      <>
        {message.info.role === "user" ? (
          <div className="flex justify-end">
            <div className="max-w-[80%]">
              <div className="ml-auto rounded-lg bg-blue-500 p-4 text-white">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-100">You</span>
                  <span className="text-xs text-blue-200">{formattedTime}</span>
                </div>
                {message.parts.length > 0 && (
                  <div className="space-y-3">
                    {message.parts.map((part) => (
                      <MessagePart key={part.id} part={part} isUser={true} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-medium">
                Assistant
              </span>
              <span className="text-muted-foreground text-xs">
                {formattedTime}
              </span>
            </div>
            {message.parts.length > 0 && (
              <div className="space-y-4">
                {message.parts.map((part) => (
                  <MessagePart key={part.id} part={part} isUser={false} />
                ))}
              </div>
            )}
          </div>
        )}
      </>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if message content changed
    return (
      prevProps.message.info.id === nextProps.message.info.id &&
      prevProps.message.parts.length === nextProps.message.parts.length
    )
  },
)
