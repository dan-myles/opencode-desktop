"use no memo"

import { useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { cn } from "@/app/lib/utils"
import { ChatMessage } from "./chat-message"

interface VirtualizedChatMessagesProps {
  messages: MessageWithParts[]
}

export function VirtualizedChatMessages({
  messages,
}: VirtualizedChatMessagesProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: messages.length,
    overscan: 5,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const reverseIndex = messages.length - 1 - index
      return estimateMessageSize(messages[reverseIndex])
    },
    getItemKey: (index) => {
      const reverseIndex = messages.length - 1 - index
      return messages[reverseIndex]?.info.id || index
    },
  })

  // Invert wheel scroll for natural scrolling behavior
  useEffect(() => {
    const el = parentRef.current
    if (!el) return

    const invertedWheelScroll = (event: WheelEvent) => {
      el.scrollTop -= event.deltaY
      event.preventDefault()
    }

    el.addEventListener("wheel", invertedWheelScroll, false)
    return () => el.removeEventListener("wheel", invertedWheelScroll)
  }, [])

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center opacity-60">
        <div className="text-muted-foreground py-8 text-center">
          No messages in this session yet. Start a conversation below!
        </div>
      </div>
    )
  }

  return (
    <div
      ref={parentRef}
      className="h-full overflow-y-auto"
      style={{ transform: "scaleY(-1)" }}
    >
      <div className={`h-[${virtualizer.getTotalSize()}] relative w-full`}>
        {virtualizer.getVirtualItems().map((virtualItem) => {
          // Calculate reverse index for message access
          const reverseIndex = messages.length - 1 - virtualItem.index
          const message = messages[reverseIndex]

          return (
            <div
              className={cn(
                "absolute top-0 left-0 w-full px-40 pb-6",
                reverseIndex === 0 && "pt-[5.25rem]",
                virtualItem.index === 0 && "pb-[8.5rem]",
              )}
              key={virtualItem.key}
              data-index={virtualItem.index}
              reverse-index={reverseIndex}
              ref={virtualizer.measureElement}
              style={{
                transform: `translateY(${virtualItem.start}px) scaleY(-1)`,
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
