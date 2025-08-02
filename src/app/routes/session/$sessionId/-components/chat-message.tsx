import { Bot, User } from "lucide-react"

import type { MessageWithParts, Part } from "@/server/routers/session/types"
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar"
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

function renderPart(part: Part) {
  switch (part.type) {
    case "text":
      return <TextPart key={part.id} part={part} />
    case "tool":
    case "tool_use":
    case "tool_result":
      return <ToolPart key={part.id} part={part} />
    case "code":
      return <CodePart key={part.id} part={part} />
    case "file":
      return <FilePart key={part.id} part={part} />
    case "error":
      return <ErrorPart key={part.id} part={part} />
    case "step-start":
    case "step-finish":
      return <StepPart key={part.id} part={part} />
    case "image":
      return <ImagePart key={part.id} part={part} />
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
        />
      )
    default:
      // Fallback for unknown types
      return (
        <div key={part.id} className="bg-muted/30 rounded-lg border p-3">
          <div className="text-muted-foreground mb-2 font-mono text-xs">
            {part.type}
          </div>
          <pre className="text-xs whitespace-pre-wrap">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      )
  }
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.info.role === "user"

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={
            isUser ? "bg-blue-500 text-white" : "bg-green-500 text-white"
          }
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </AvatarFallback>
      </Avatar>

      <div className={`min-w-0 flex-1 ${isUser ? "max-w-[80%]" : ""}`}>
        <div
          className={`rounded-lg p-4 ${
            isUser ? "ml-auto bg-blue-500 text-white" : "bg-background border"
            }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`text-sm font-medium ${isUser ? "text-blue-100" : ""}`}
            >
              {isUser ? "You" : "Assistant"}
            </span>
            <span
              className={`text-xs
                ${isUser ? "text-blue-200" : "text-muted-foreground"}`}
            >
              {new Date(message.info.time.created * 1000).toLocaleTimeString()}
            </span>
          </div>

          {message.parts.length > 0 && (
            <div className="space-y-3">{message.parts.map(renderPart)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
