import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"

interface WriteToolProps {
  part: ToolPartType
}

export function WriteTool({ part }: WriteToolProps) {
  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const getFilePath = () => {
    if (part.state.status === "running" && part.state.title) {
      return part.state.title
    }
    if (part.state.status === "completed" && part.state.title) {
      return part.state.title
    }
    return "Writing file..."
  }

  const getFileContent = () => {
    if (part.state.status === "completed" && part.state.output) {
      return truncateText(part.state.output)
    }
    if (part.state.status === "error" && part.state.error) {
      return truncateText(part.state.error)
    }
    return null
  }

  const filePath = getFilePath()
  const fileContent = getFileContent()

  const hasContent = fileContent && fileContent.length > 0
  const isMinimal = !hasContent || fileContent.length < 100

  return (
    <div
      className={`space-y-2 overflow-hidden
        ${isMinimal ? "min-h-20" : "max-h-80 min-h-32"}`}
    >
      <div className="flex items-center gap-2">
        <span
          className="font-mono text-sm font-medium text-slate-900
            dark:text-slate-100"
        >
          Writing
        </span>
        <span className="text-muted-foreground truncate text-sm">
          {filePath}
        </span>
      </div>

      <div
        className="overflow-hidden rounded bg-green-50 p-4 text-xs
          dark:bg-green-950/20"
      >
        {fileContent && (
          <div
            className="font-mono whitespace-pre-wrap text-slate-600
              dark:text-slate-300"
          >
            {fileContent}
          </div>
        )}
      </div>
    </div>
  )
}
