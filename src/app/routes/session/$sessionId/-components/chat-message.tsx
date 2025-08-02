import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { CodePart } from "./parts/code-part"
import { ErrorPart } from "./parts/error-part"
import { FilePart } from "./parts/file-part"
import { ImagePart } from "./parts/image-part"
import { StepPart } from "./parts/step-part"
import { TextPart } from "./parts/text-part"
import { ToolPart } from "./parts/tool-part"

interface ChatMessageProps {
  message: MessageWithParts
}

function renderPart(part: Part, isUser: boolean) {
  switch (part.type) {
    case "text":
      return <TextPart key={part.id} part={part} isUser={isUser} />
    case "tool":
    case "tool_use":
    case "tool_result":
      return <ToolPart key={part.id} part={part} isUser={isUser} />
    case "code":
      return <CodePart key={part.id} part={part} isUser={isUser} />
    case "file":
      return <FilePart key={part.id} part={part} isUser={isUser} />
    case "error":
      return <ErrorPart key={part.id} part={part} isUser={isUser} />
    case "step-start":
    case "step-finish":
      return <StepPart key={part.id} part={part} isUser={isUser} />
    case "image":
      return <ImagePart key={part.id} part={part} isUser={isUser} />
    case "snapshot":
    case "patch":
      return (
        <CodePart
          key={part.id}
          part={{
            ...part,
            code: JSON.stringify(part, null, 2),
            language: "json",
          }}
          isUser={isUser}
        />
      )
    default:
      // Fallback for unknown types
      return (
        <div
          key={part.id}
          className={isUser ? "text-blue-100" : "bg-muted rounded-lg p-3"}
        >
          <div className="text-muted-foreground mb-2 font-mono text-xs">
            {part.type}
          </div>
          <pre className="text-foreground text-xs whitespace-pre-wrap">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      )
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.info.role === "user"

  if (isUser) {
    // User messages: Keep blue bubble styling, no avatar
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%]">
          <div className="ml-auto rounded-lg bg-blue-500 p-4 text-white">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-sm font-medium text-blue-100">You</span>
              <span className="text-xs text-blue-200">
                {new Date(
                  message.info.time.created * 1000,
                ).toLocaleTimeString()}
              </span>
            </div>
            {message.parts.length > 0 && (
              <div className="space-y-3">
                {message.parts.map((part) => renderPart(part, true))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Assistant messages: Clean, borderless design, no avatar
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-muted-foreground text-sm font-medium">
          Assistant
        </span>
        <span className="text-muted-foreground text-xs">
          {new Date(message.info.time.created * 1000).toLocaleTimeString()}
        </span>
      </div>
      {message.parts.length > 0 && (
        <div className="space-y-4">
          {message.parts.map((part) => renderPart(part, false))}
        </div>
      )}
    </div>
  )
}
