"use no memo"

import { useEffect, useRef } from "react"
import { useVirtualizer } from "@tanstack/react-virtual"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { cn } from "@/app/lib/utils"
import { ChatMessage } from "./chat-message"

interface VirtualizedChatMessagesProps {
  messages: Array<{ info: Message; parts: Part[] }>
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

function estimateMessageSize(_message: {
  info: Message
  parts: Part[]
}): number {
  let baseHeight = 80 // Base message height with header and padding
  baseHeight += 32
  return Math.max(baseHeight, 120) // Minimum height for any message
}
