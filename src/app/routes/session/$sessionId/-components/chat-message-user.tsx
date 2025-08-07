import { useMemo } from "react"

import type { Message, Part } from "@/server/sdk/gen/types.gen"

interface ChatMessageUserProps {
  message: { info: Message; parts: Part[] }
}

export function ChatMessageUser({ message }: ChatMessageUserProps) {
  const formattedTime = useMemo(
    () => new Date(message.info.time.created * 1000).toLocaleTimeString(),
    [message.info.time.created],
  )

  return (
    <div className="flex justify-end">
      <div className="max-w-[80%]">
        <div
          className="bg-accent border-r-accent-foreground rounded-lg border-r-4
            p-4 shadow-[0_0_8px_-2px_hsl(var(--accent-foreground)/0.3)]"
        >
          {message.parts.length > 0 && (
            <div className="mb-2 space-y-3">
              {message.parts.map((part) => (
                <div key={part.id}>{part.type}</div>
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
  )
}
