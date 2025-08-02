import type { Part } from "@/server/routers/session/types"

interface TextPartProps {
  part: Part & { text?: string }
}

export function TextPart({ part }: TextPartProps) {
  const text = part.text || JSON.stringify(part, null, 2)

  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <div className="text-sm leading-relaxed whitespace-pre-wrap">
        {typeof text === "string" ? text : JSON.stringify(text, null, 2)}
      </div>
    </div>
  )
}
