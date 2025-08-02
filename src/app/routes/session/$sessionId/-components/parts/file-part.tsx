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
}

export function FilePart({ part }: FilePartProps) {
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

  return (
    <div className="bg-muted/30 rounded-lg border p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <File className="text-muted-foreground h-5 w-5" />
          <div>
            <div className="text-sm font-medium">{filename}</div>
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
            className="h-8 w-8 p-0"
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
