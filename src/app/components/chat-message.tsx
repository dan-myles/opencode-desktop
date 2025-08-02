import type { MessageWithParts, Part } from "@/server/routers/session/types"

interface ChatMessageProps {
  message: MessageWithParts
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className="rounded-lg border p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-sm font-medium capitalize">
          {message.info.role}
        </span>
        <span className="text-muted-foreground text-xs">
          {new Date(message.info.time.created * 1000).toLocaleString()}
        </span>
      </div>

      {message.parts.length > 0 && (
        <div className="space-y-2">
          {message.parts.map((part: Part) => (
            <div key={part.id} className="text-sm">
              <span className="text-muted-foreground font-mono text-xs">
                {part.type}:
              </span>
              <pre className="mt-1 whitespace-pre-wrap">
                {JSON.stringify(part, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
