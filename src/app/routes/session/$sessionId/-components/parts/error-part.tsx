import { AlertTriangle } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Alert, AlertDescription } from "@/app/components/ui/alert"

interface ErrorPartProps {
  part: Part & {
    error?: string
    message?: string
    stack?: string
  }
}

export function ErrorPart({ part }: ErrorPartProps) {
  const message = String(part.error || part.message || "An error occurred")
  const stack = part.stack ? String(part.stack) : undefined

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription>
        <div className="space-y-2">
          <div className="font-medium">{message}</div>
          {stack && (
            <details className="text-xs">
              <summary className="text-muted-foreground cursor-pointer">
                Stack trace
              </summary>
              <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">
                {stack}
              </pre>
            </details>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
