import { ExternalLinkIcon } from "lucide-react"

import type { FilePart as FilePartType } from "@/server/sdk/gen/types.gen"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

interface FilePartProps {
  part: FilePartType
}

export function FilePart({ part }: FilePartProps) {
  const getMimeTypeDisplay = (mime: string) => {
    const [type, subtype] = mime.split("/")
    return subtype?.toUpperCase() || type?.toUpperCase() || "FILE"
  }

  const getFileIcon = (mime: string) => {
    if (mime.startsWith("image/")) return "🖼️"
    if (mime.startsWith("text/")) return "📄"
    if (mime.startsWith("application/json")) return "📋"
    if (mime.includes("pdf")) return "📕"
    return "📁"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg">{getFileIcon(part.mime)}</span>
          <div>
            <div className="text-sm font-medium">
              {part.filename || "Untitled file"}
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {getMimeTypeDisplay(part.mime)}
              </Badge>
              {part.source && (
                <Badge variant="outline" className="text-xs">
                  {part.source.type}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" asChild>
          <a href={part.url} target="_blank" rel="noopener noreferrer">
            <ExternalLinkIcon className="h-4 w-4" />
          </a>
        </Button>
      </div>

      {part.source && part.source.type === "file" && (
        <div className="text-muted-foreground text-sm">
          <div className="font-medium">Path:</div>
          <div className="font-mono text-xs">{part.source.path}</div>
          {part.source.text && (
            <div className="mt-1">
              <div className="font-medium">
                Lines {part.source.text.start}-{part.source.text.end}:
              </div>
              <div
                className="bg-muted mt-1 rounded p-2 font-mono text-xs
                  whitespace-pre-wrap"
              >
                {part.source.text.value}
              </div>
            </div>
          )}
        </div>
      )}

      {part.source && part.source.type === "symbol" && (
        <div className="text-muted-foreground text-sm">
          <div className="font-medium">Symbol: {part.source.name}</div>
          <div className="font-mono text-xs">{part.source.path}</div>
          <div className="text-xs">
            Lines {part.source.range.start.line + 1}-
            {part.source.range.end.line + 1}
          </div>
          {part.source.text && (
            <div
              className="bg-muted mt-1 rounded p-2 font-mono text-xs
                whitespace-pre-wrap"
            >
              {part.source.text.value}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
