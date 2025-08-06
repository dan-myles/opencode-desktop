import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/app/components/ui/collapsible"

interface ToolPartProps {
  part: ToolPartType
}

export function ToolPart({ part }: ToolPartProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "running":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const formatDuration = (start: number, end?: number) => {
    if (!end) return "Running..."
    const duration = end - start
    return `${(duration / 1000).toFixed(2)}s`
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium">{part.tool}</span>
          <Badge className={getStatusColor(part.state.status)}>
            {part.state.status}
          </Badge>
        </div>

        {(part.state.status === "completed" ||
          part.state.status === "error") && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                Details
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        )}
      </div>

      {part.state.status === "running" &&
        "title" in part.state &&
        part.state.title && (
          <div className="text-muted-foreground text-sm">
            {part.state.title}
          </div>
        )}

      {part.state.status === "completed" && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-2">
            <div className="text-sm">
              <div className="mb-1 font-medium">Title:</div>
              <div className="text-muted-foreground">{part.state.title}</div>
            </div>

            <div className="text-sm">
              <div className="mb-1 font-medium">Duration:</div>
              <div className="text-muted-foreground">
                {formatDuration(part.state.time.start, part.state.time.end)}
              </div>
            </div>

            {part.state.output && (
              <div className="text-sm">
                <div className="mb-1 font-medium">Output:</div>
                <div
                  className="bg-muted rounded p-2 font-mono text-xs
                    whitespace-pre-wrap"
                >
                  {part.state.output}
                </div>
              </div>
            )}

            {part.state.input && Object.keys(part.state.input).length > 0 && (
              <div className="text-sm">
                <div className="mb-1 font-medium">Input:</div>
                <div className="bg-muted rounded p-2 font-mono text-xs">
                  {JSON.stringify(part.state.input, null, 2)}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}

      {part.state.status === "error" && (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-2">
            <div className="text-sm">
              <div className="mb-1 font-medium">Duration:</div>
              <div className="text-muted-foreground">
                {formatDuration(part.state.time.start, part.state.time.end)}
              </div>
            </div>

            <div className="text-sm">
              <div className="mb-1 font-medium">Error:</div>
              <div
                className="rounded bg-red-50 p-2 font-mono text-xs text-red-800
                  dark:bg-red-900/20 dark:text-red-200"
              >
                {part.state.error}
              </div>
            </div>

            {part.state.input && Object.keys(part.state.input).length > 0 && (
              <div className="text-sm">
                <div className="mb-1 font-medium">Input:</div>
                <div className="bg-muted rounded p-2 font-mono text-xs">
                  {JSON.stringify(part.state.input, null, 2)}
                </div>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  )
}
