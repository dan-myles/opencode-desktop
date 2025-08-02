import { Copy } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Button } from "@/app/components/ui/button"

interface CodePartProps {
  part: Part & {
    code?: string
    language?: string
  }
}

export function CodePart({ part }: CodePartProps) {
  const code = part.code || JSON.stringify(part, null, 2)
  const language = part.language || "text"

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code)
  }

  return (
    <div className="group relative">
      <div className="bg-muted overflow-hidden rounded-lg">
        <div
          className="bg-muted/50 flex items-center justify-between border-b px-3
            py-2"
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
          <code className="font-mono">
            {typeof code === "string" ? code : JSON.stringify(code, null, 2)}
          </code>
        </pre>
      </div>
    </div>
  )
}
