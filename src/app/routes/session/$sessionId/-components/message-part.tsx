import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Cog,
  Copy,
  Download,
  File,
  Image as ImageIcon,
  Play,
  Square,
  XCircle,
} from "lucide-react"

import type { Part } from "@/server/routers/session/types"
import { Badge } from "@/app/components/ui/badge"
import { Button } from "@/app/components/ui/button"
import { MarkdownRenderer } from "@/app/components/ui/markdown-renderer"

interface MessagePartProps {
  part: Part
  isUser: boolean
}

export function MessagePart({ part, isUser }: MessagePartProps) {
  switch (part.type) {
    case "text":
      const text = (part as any).text || JSON.stringify(part, null, 2)

      if (isUser) {
        return (
          <div className="text-sm leading-relaxed whitespace-pre-wrap">
            {typeof text === "string" ? text : JSON.stringify(text, null, 2)}
          </div>
        )
      }

      return (
        <MarkdownRenderer>
          {typeof text === "string" ? text : JSON.stringify(text, null, 2)}
        </MarkdownRenderer>
      )

    case "code":
      const code = (part as any).code || JSON.stringify(part, null, 2)
      const language = (part as any).language || "text"

      const copyToClipboard = () => {
        navigator.clipboard.writeText(
          typeof code === "string" ? code : JSON.stringify(code, null, 2),
        )
      }

      if (isUser) {
        return (
          <div className="rounded bg-blue-600 p-2 text-blue-100">
            <div className="mb-1 text-xs text-blue-200">{language}</div>
            <pre className="font-mono text-xs whitespace-pre-wrap">
              <code>
                {typeof code === "string"
                  ? code
                  : JSON.stringify(code, null, 2)}
              </code>
            </pre>
          </div>
        )
      }

      return (
        <div className="group bg-muted relative overflow-hidden rounded-lg">
          <div className="bg-muted border-border flex items-center justify-between border-b px-3 py-2">
            <span className="text-muted-foreground text-xs font-medium">
              {language}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100"
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

    case "error":
      const message = String(
        (part as any).error || (part as any).message || "An error occurred",
      )

      if (isUser) {
        return <div className="text-sm text-red-200">⚠️ {message}</div>
      }

      return (
        <div className="bg-destructive/10 border-destructive/20 rounded-lg border p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-destructive mt-0.5 h-5 w-5 flex-shrink-0" />
            <div className="text-destructive-foreground text-sm font-medium">
              {message}
            </div>
          </div>
        </div>
      )

    case "file":
      const filename = String((part as any).filename || "Unknown file")
      const mime = String((part as any).mime || "application/octet-stream")
      const size = (part as any).size
      const url = (part as any).url

      const formatFileSize = (bytes?: number) => {
        if (!bytes) return ""
        const sizes = ["B", "KB", "MB", "GB"]
        const i = Math.floor(Math.log(bytes) / Math.log(1024))
        return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
      }

      const handleDownload = () => {
        if (url) {
          window.open(url, "_blank")
        }
      }

      if (isUser) {
        return <div className="text-sm text-blue-100">📎 {filename}</div>
      }

      return (
        <div className="bg-primary/10 border-primary/20 rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <File className="text-primary h-5 w-5" />
              <div>
                <div className="text-foreground text-sm font-medium">
                  {filename}
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <Badge variant="outline" className="text-xs">
                    {mime.split("/")[1]?.toUpperCase() || "FILE"}
                  </Badge>
                  {size && <span>{formatFileSize(size)}</span>}
                </div>
              </div>
            </div>
            {url && (
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

    case "image":
      const imageUrl = (part as any).url
      const imageFilename = String((part as any).filename || "Image")
      const alt = String((part as any).alt || imageFilename)

      if (!imageUrl) {
        return (
          <div
            className={`flex items-center gap-2 rounded-lg p-3 ${
              isUser ? "text-blue-200" : "bg-muted border-border border"
            }`}
          >
            <ImageIcon
              className={`h-5 w-5 ${isUser ? "text-blue-200" : "text-muted-foreground"}`}
            />
            <span className="text-sm">Image not available</span>
          </div>
        )
      }

      if (isUser) {
        return (
          <div className="overflow-hidden rounded">
            <img
              src={imageUrl}
              alt={alt}
              className="h-auto max-w-full rounded"
              style={{ maxHeight: "200px" }}
            />
            {imageFilename && (
              <div className="mt-1 text-xs text-blue-200">{imageFilename}</div>
            )}
          </div>
        )
      }

      return (
        <div className="overflow-hidden rounded-lg">
          <img
            src={imageUrl}
            alt={alt}
            className="h-auto max-w-full"
            style={{ maxHeight: "400px" }}
          />
          {imageFilename && (
            <div className="text-muted-foreground bg-muted p-2 text-xs">
              {imageFilename}
            </div>
          )}
        </div>
      )

    case "step-start":
    case "step-finish":
      const isStart = part.type === "step-start"
      const isFinish = part.type === "step-finish"
      const step = String((part as any).step || "Processing")

      if (isUser) {
        return (
          <div className="text-sm text-blue-200">
            {isStart ? "▶️" : isFinish ? "⏹️" : "⏳"} {step}
          </div>
        )
      }

      return (
        <div className="bg-primary/10 border-primary/20 flex items-center gap-3 rounded-lg border px-3 py-2">
          <div className="flex-shrink-0">
            {isStart && <Play className="text-primary h-4 w-4" />}
            {isFinish && <Square className="text-accent-foreground h-4 w-4" />}
            {!isStart && !isFinish && (
              <Clock className="text-muted-foreground h-4 w-4" />
            )}
          </div>
          <div className="text-foreground text-sm font-medium">{step}</div>
        </div>
      )

    case "tool":
    case "tool_use":
    case "tool_result":
      const toolName = String((part as any).name || "Tool")
      const state = (part as any).state
      const stateString =
        typeof state === "string"
          ? state
          : typeof state === "object" && state?.status
            ? String(state.status)
            : "pending"

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
        return (
          <div className="text-sm text-blue-100">
            Tool: {toolName} ({stateString})
          </div>
        )
      }

      return (
        <div className={`rounded-lg border p-3 ${getBackgroundColor()}`}>
          <div className="flex items-center gap-3">
            <Cog className="text-muted-foreground h-4 w-4" />
            <span className="text-sm font-medium">{toolName}</span>
            {getStateIcon()}
            <Badge variant="outline" className="text-xs">
              {stateString}
            </Badge>
          </div>
        </div>
      )

    case "snapshot":
    case "patch":
      return (
        <MessagePart
          part={
            {
              ...part,
              type: "code",
              code: JSON.stringify(part, null, 2),
              language: "json",
            } as Part
          }
          isUser={isUser}
        />
      )

    default:
      return (
        <div className={isUser ? "text-blue-100" : "bg-muted rounded-lg p-3"}>
          <div className="text-muted-foreground mb-2 font-mono text-xs">
            {part.type}
          </div>
          <pre className="text-foreground text-xs whitespace-pre-wrap">
            {JSON.stringify(part, null, 2)}
          </pre>
        </div>
      )
  }
}
