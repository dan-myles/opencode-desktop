import { useMemo } from "react"

import type {
  Message,
  TextPart as TextPartType,
} from "@/server/sdk/gen/types.gen"

interface TextPartProps {
  part: TextPartType
  message: Message
}

export function TextPart({ part, message }: TextPartProps) {
  const formattedTime = useMemo(
    () => new Date(message.time.created * 1000).toLocaleTimeString(),
    [message.time.created],
  )

  const modelInfo = useMemo(() => {
    if (message.role === "assistant") {
      return `${message.providerID}/${message.modelID}`
    }
    return null
  }, [message])

  return (
    <div
      className="bg-muted border-l-primary rounded-lg border-l-4 p-4
        shadow-[0_0_8px_-2px_hsl(var(--primary)/0.3)]"
    >
      <div className="mb-2 space-y-3">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div className="whitespace-pre-wrap">{part.text}</div>
          {part.synthetic && (
            <div className="text-muted-foreground mt-2 text-xs">
              Synthetic content
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        {modelInfo && (
          <span className="text-muted-foreground font-mono text-sm font-medium">
            {modelInfo}
          </span>
        )}
        <span className="text-muted-foreground text-xs">{formattedTime}</span>
      </div>
    </div>
  )
}
