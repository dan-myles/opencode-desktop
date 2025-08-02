import { Copy } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Button } from "@/app/components/ui/button"

interface CodePartProps {
  part: Part & {
    code?: string
    language?: string
  }
  isUser: boolean
}

export function CodePart({ part, isUser }: CodePartProps) {
  const code = part.code || JSON.stringify(part, null, 2)
  const language = part.language || "text"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(
      typeof code === "string" ? code : JSON.stringify(code, null, 2),
    )
  }

  if (isUser) {
    // User code: Simple display within blue bubble
    return (
      <div className="rounded bg-blue-600 p-2 text-blue-100">
        <div className="mb-1 text-xs text-blue-200">{language}</div>
        <pre className="font-mono text-xs whitespace-pre-wrap">
          <code>
            {typeof code === "string" ? code : JSON.stringify(code, null, 2)}
          </code>
        </pre>
      </div>
    )
  }

  // Assistant code: Clean display with copy functionality, using theme colors
  return (
    <div className="group bg-muted relative overflow-hidden rounded-lg">
      <div
        className="bg-muted border-border flex items-center justify-between
          border-b px-3 py-2"
      >
        <span className="text-muted-foreground text-xs font-medium">
          {language}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-6 w-6 p-0 opacity-0 transition-opacity
            group-hover:opacity-100"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
      <pre className="overflow-x-auto p-3 text-sm">
        <code className="text-foreground font-mono">
          {typeof code === "string" ? code : JSON.stringify(code, null, 2)}
        </code>
      </pre>
    </div>
  )
}
