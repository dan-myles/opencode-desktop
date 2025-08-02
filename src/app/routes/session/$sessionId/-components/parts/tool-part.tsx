import { useState } from "react"
import {
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Clock,
  Cog,
  XCircle,
} from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible"

interface ToolPartProps {
  part: Part & {
    callID?: string
    name?: string
    state?: string | { status?: string; [key: string]: any }
    input?: any
    output?: any
  }
}

export function ToolPart({ part }: ToolPartProps) {
  const [isOpen, setIsOpen] = useState(false)

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
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "running":
        return <Clock className="h-4 w-4 animate-spin text-blue-500" />
      default:
        return <Clock className="text-muted-foreground h-4 w-4" />
    }
  }

  const getStateBadge = () => {
    const variant =
      stateString === "completed"
        ? "default"
        : stateString === "error"
          ? "destructive"
          : "secondary"

    return (
      <Badge variant={variant} className="text-xs">
        {stateString}
      </Badge>
    )
  }

  return (
    <div className="bg-muted/30 rounded-lg border">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto w-full justify-between p-3 font-normal"
          >
            <div className="flex items-center gap-2">
              <Cog className="text-muted-foreground h-4 w-4" />
              <span className="font-medium">{String(part.name || "Tool")}</span>
              {getStateIcon()}
              {getStateBadge()}
            </div>
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-3 pb-3">
          <div className="space-y-2 text-sm">
            {part.callID && (
              <div>
                <span className="text-muted-foreground font-mono text-xs">
                  Call ID:
                </span>
                <div className="bg-muted mt-1 rounded p-2 font-mono text-xs">
                  {String(part.callID)}
                </div>
              </div>
            )}
            {part.input && (
              <div>
                <span className="text-muted-foreground font-mono text-xs">
                  Input:
                </span>
                <pre
                  className="bg-muted mt-1 overflow-x-auto rounded p-2 text-xs"
                >
                  {typeof part.input === "string"
                    ? part.input
                    : JSON.stringify(part.input, null, 2)}
                </pre>
              </div>
            )}
            {part.output && (
              <div>
                <span className="text-muted-foreground font-mono text-xs">
                  Output:
                </span>
                <pre
                  className="bg-muted mt-1 overflow-x-auto rounded p-2 text-xs"
                >
                  {typeof part.output === "string"
                    ? part.output
                    : JSON.stringify(part.output, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
