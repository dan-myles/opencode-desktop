import { AlertTriangle } from "lucide-react"

import type { Part } from "@/server/routers/session/types"

interface ErrorPartProps {
  part: Part & {
    error?: string
    message?: string
    stack?: string
  }
  isUser: boolean
}

export function ErrorPart({ part, isUser }: ErrorPartProps) {
  const message = String(part.error || part.message || "An error occurred")
  const stack = part.stack ? String(part.stack) : undefined

  if (isUser) {
    // User errors: Simple display within blue bubble
    return <div className="text-sm text-red-200">⚠️ {message}</div>
  }

  // Assistant errors: Using theme destructive colors
  return (
    <div
      className="bg-destructive/10 border-destructive/20 rounded-lg border p-4"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="flex-1">
          <div className="text-destructive-foreground text-sm font-medium">
            {message}
          </div>
          {stack && (
            <details className="mt-2">
              <summary
                className="text-destructive hover:text-destructive/80
                  cursor-pointer text-xs"
              >
                Stack trace
              </summary>
              <pre
                className="text-destructive bg-destructive/5 mt-2 rounded p-2
                  font-mono text-xs whitespace-pre-wrap"
              >
                {stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  )
}
