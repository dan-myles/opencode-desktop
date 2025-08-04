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

    const modelInfo = useMemo(() => {
      if (message.info.role === "assistant") {
        const assistantMessage = message.info as any
        return `${assistantMessage.providerID}/${assistantMessage.modelID}`
      }
      return null
    }, [message.info])

    return (
      <>
        {message.info.role === "user" ? (
          <div className="flex justify-end">
            <div className="max-w-[80%]">
              <div
                className="bg-accent border-r-accent-foreground rounded-lg
                  border-r-4 p-4
                  shadow-[0_0_8px_-2px_hsl(var(--accent-foreground)/0.3)]"
              >
                {message.parts.length > 0 && (
                  <div className="mb-2 space-y-3">
                    {message.parts.map((part) => (
                      <MessagePart key={part.id} part={part} isUser={true} />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-2 text-right">
                  <span className="text-accent-foreground text-sm font-medium">
                    You
                  </span>
                  <span className="text-accent-foreground/70 text-xs">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {message.parts.length > 0 && (
              <div className="mb-2 space-y-4">
                {message.parts.map((part) => {
                  // Style text messages like user messages
                  if (part.type === "text") {
                    return (
                      <div key={part.id} className="w-full">
                        <div
                          className="bg-muted border-l-primary rounded-lg
                            border-l-4 p-4
                            shadow-[0_0_8px_-2px_hsl(var(--primary)/0.3)]"
                        >
                          <div className="mb-2 space-y-3">
                            <MessagePart
                              key={part.id}
                              part={part}
                              isUser={false}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            {modelInfo && (
                              <span
                                className="text-muted-foreground font-mono
                                  text-sm font-medium"
                              >
                                {modelInfo}
                              </span>
                            )}
                            <span className="text-muted-foreground text-xs">
                              {formattedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  // Regular styling for tool calls and other message types
                  return (
                    <MessagePart key={part.id} part={part} isUser={false} />
                  )
                })}
              </div>
            )}
            {/* Only show metadata at bottom if no text messages */}
            {!message.parts.some((part) => part.type === "text") && (
              <div className="flex items-center gap-2">
                {modelInfo && (
                  <span
                    className="text-muted-foreground font-mono text-sm
                      font-medium"
                  >
                    {modelInfo}
                  </span>
                )}
                <span className="text-muted-foreground text-xs">
                  {formattedTime}
                </span>
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
