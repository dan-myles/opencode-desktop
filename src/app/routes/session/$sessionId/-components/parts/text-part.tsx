import type { Part } from "@/server/routers/session/types"

interface TextPartProps {
  part: Part & { text?: string }
  isUser: boolean
}

export function TextPart({ part, isUser }: TextPartProps) {
  const text = part.text || JSON.stringify(part, null, 2)

  if (isUser) {
    // User text: Keep current styling within blue bubble
    return (
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {typeof text === "string" ? text : JSON.stringify(text, null, 2)}
      </div>
    )
  }

  // Assistant text: Large, prominent, clean styling
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div
        className="text-foreground text-base leading-relaxed
          whitespace-pre-wrap"
      >
        {typeof text === "string" ? text : JSON.stringify(text, null, 2)}
      </div>
    </div>
  )
}
