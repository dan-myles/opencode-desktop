import { Download, File } from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"

interface FilePartProps {
  part: Part & {
    filename?: string
    mime?: string
    url?: string
    size?: number
  }
  isUser: boolean
}

export function FilePart({ part, isUser }: FilePartProps) {
  const filename = String(part.filename || "Unknown file")
  const mime = String(part.mime || "application/octet-stream")
  const size = part.size

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ""
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  const handleDownload = () => {
    if (part.url) {
      window.open(part.url, "_blank")
    }
  }

  if (isUser) {
    // User files: Simple display within blue bubble
    return <div className="text-sm text-blue-100">📎 {filename}</div>
  }

  // Assistant files: Clean display using theme colors
  return (
    <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <File className="text-primary h-5 w-5" />
          <div>
            <div className="text-foreground text-sm font-medium">
              {filename}
            </div>
            <div
              className="text-muted-foreground flex items-center gap-2 text-xs"
            >
              <Badge variant="outline" className="text-xs">
                {mime.split("/")[1]?.toUpperCase() || "FILE"}
              </Badge>
              {size && <span>{formatFileSize(size)}</span>}
            </div>
          </div>
        </div>
        {part.url && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="text-primary hover:bg-primary/20 h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
