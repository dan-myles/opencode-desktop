import type { Message, Part } from "@/server/sdk/gen/types.gen"

interface ChatMessageAssistantProps {
  message: { info: Message; parts: Part[] }
  formattedTime: string
  modelInfo: string | null
}

export function ChatMessageAssistant({
  message,
  formattedTime,
  modelInfo,
}: ChatMessageAssistantProps) {
  return (
    <div className="w-full">
      <div className="mb-2 space-y-4">
        {message.parts.map((part) => {
          return (
            <div key={part.id} className="w-full">
              <div
                className="bg-muted border-l-primary rounded-lg border-l-4 p-4
                  shadow-[0_0_8px_-2px_hsl(var(--primary)/0.3)]"
              >
                <div className="mb-2 space-y-3">{part.id}</div>
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
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
