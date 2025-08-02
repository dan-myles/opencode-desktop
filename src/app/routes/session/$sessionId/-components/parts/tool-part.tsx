import { CheckCircle, Clock, Cog, XCircle } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Badge } from "@/app/components/ui/badge"

interface ToolPartProps {
  part: Part & {
    callID?: string
    name?: string
    state?: string | { status?: string; [key: string]: any }
    input?: any
    output?: any
  }
  isUser: boolean
}

export function ToolPart({ part, isUser }: ToolPartProps) {
  // Extract state string from object or use as string
  const getStateString = () => {
    if (typeof part.state === "string") {
      return part.state
    }
    if (typeof part.state === "object" && part.state?.status) {
      return String(part.state.status)
    }
    return "pending"
  }

  const stateString = getStateString()

  const getStateIcon = () => {
    switch (stateString) {
      case "completed":
        return <CheckCircle className="text-accent-foreground h-4 w-4" />
      case "error":
        return <XCircle className="text-destructive h-4 w-4" />
      case "running":
        return <Clock className="text-primary h-4 w-4 animate-spin" />
      default:
        return <Clock className="text-muted-foreground h-4 w-4" />
    }
  }

  const getBackgroundColor = () => {
    switch (stateString) {
      case "completed":
        return "bg-accent border-accent"
      case "error":
        return "bg-destructive/10 border-destructive/20"
      case "running":
        return "bg-primary/10 border-primary/20"
      default:
        return "bg-muted border-border"
    }
  }

  if (isUser) {
    // User tools: Simple text display within blue bubble
    return (
      <div className="text-sm text-blue-100">
        Tool: {String(part.name || "Unknown")} ({stateString})
      </div>
    )
  }

  // Assistant tools: Inline display with status colors, no dropdowns
  return (
    <div className={`rounded-lg border p-3 ${getBackgroundColor()}`}>
      <div className="flex items-center gap-3">
        <Cog className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">
          {String(part.name || "Tool")}
        </span>
        {getStateIcon()}
        <Badge variant="outline" className="text-xs">
          {stateString}
        </Badge>
      </div>

      {/* Show brief summary if available */}
      {part.output && (
        <div className="text-muted-foreground mt-2 text-xs">
          {typeof part.output === "string"
            ? part.output.slice(0, 100) +
              (part.output.length > 100 ? "..." : "")
            : JSON.stringify(part.output).slice(0, 100) + "..."}
        </div>
      )}
    </div>
  )
}
