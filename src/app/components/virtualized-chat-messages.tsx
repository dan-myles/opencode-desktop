import { useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { ChatMessage } from "./chat-message"

interface VirtualizedChatMessagesProps {
  messages: MessageWithParts[]
}

function estimateMessageSize(message: MessageWithParts): number {
  let baseHeight = 80 // Base message height with header and padding

  // Add height based on parts
  message.parts.forEach((part: Part) => {
    const partData = JSON.stringify(part)
    const partLength = partData.length

    switch (part.type) {
      case "text":
        // More accurate text estimation based on content
        // Assume ~80 characters per line, ~20px per line
        const estimatedLines = Math.max(1, Math.ceil(partLength / 80))
        baseHeight += estimatedLines * 20 + 40 // Add padding
        break
      case "code":
        // Code blocks: estimate lines and add syntax highlighting space
        const codeLines = Math.max(3, Math.ceil(partLength / 60)) // Code is typically shorter per line
        baseHeight += codeLines * 18 + 60 // Monospace font is denser
        break
      case "image":
        // Images have fixed height but add metadata space
        baseHeight += 220
        break
      case "file":
        // File attachments with metadata
        baseHeight += 80
        break
      case "error":
        // Error messages might be longer
        const errorLines = Math.max(2, Math.ceil(partLength / 70))
        baseHeight += errorLines * 18 + 50
        break
      case "tool_use":
      case "tool_result":
        // Tool usage can be quite verbose
        const toolLines = Math.max(2, Math.ceil(partLength / 60))
        baseHeight += toolLines * 16 + 40
        break
      default:
        // Default for unknown types - be conservative
        const defaultLines = Math.max(1, Math.ceil(partLength / 70))
        baseHeight += defaultLines * 18 + 30
        break
    }
  })

  // Add extra space for message borders and spacing
  baseHeight += 32

  return Math.max(baseHeight, 120) // Minimum height for any message
}

export function VirtualizedChatMessages({
  messages,
}: VirtualizedChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  // Reverse messages for chat order (newest at bottom)
  const reversedMessages = [...messages].reverse()

  const virtualizer = useVirtualizer({
    count: reversedMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => estimateMessageSize(reversedMessages[index]),
    overscan: 5,
    getItemKey: (index) => reversedMessages[index]?.info.id || index,
  })

  // Scroll to bottom when messages change (for chat behavior)
  useEffect(() => {
    if (parentRef.current && reversedMessages.length > 0) {
      // Scroll to bottom after a brief delay to allow rendering
      const timer = setTimeout(() => {
        if (parentRef.current) {
          parentRef.current.scrollTop = parentRef.current.scrollHeight
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [reversedMessages.length])

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-muted-foreground py-8 text-center">
          No messages in this session yet. Start a conversation below!
        </div>
      </div>
    )
  }

  return (
    <div ref={parentRef} className="flex-1 overflow-y-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const message = reversedMessages[virtualItem.index]

          return (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
                padding: "0 16px 16px 16px",
              }}
            >
              <ChatMessage message={message} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
