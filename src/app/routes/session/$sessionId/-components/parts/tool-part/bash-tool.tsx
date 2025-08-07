import type { ToolPart as ToolPartType } from "@/server/sdk/gen/types.gen"

interface BashToolProps {
  part: ToolPartType
}

export function BashTool({ part }: BashToolProps) {
  const truncateText = (text: string, maxLength: number = 500) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  const getCommand = () => {
    if (part.state.status === "running" && part.state.title) {
      return part.state.title
    }
    if (part.state.status === "completed" && part.state.title) {
      return part.state.title
    }
    return "Running command..."
  }

  const getOutput = () => {
    if (part.state.status === "completed" && part.state.output) {
      return truncateText(part.state.output)
    }
    if (part.state.status === "error" && part.state.error) {
      return truncateText(part.state.error)
    }
    return null
  }

  const getDescription = () => {
    if (
      part.state.status === "completed" &&
      part.state.input &&
      typeof part.state.input === "object" &&
      "description" in part.state.input
    ) {
      return part.state.input.description as string
    }
    if (
      part.state.status === "running" &&
      part.state.input &&
      typeof part.state.input === "object" &&
      "description" in part.state.input
    ) {
      return part.state.input.description as string
    }
    return null
  }

  const command = getCommand()
  const output = getOutput()
  const description = getDescription()

  const hasContent = output && output.length > 0
  const isMinimal = !hasContent || output.length < 100

  return (
    <div
      className={`space-y-2 overflow-hidden
        ${isMinimal ? "min-h-20" : "max-h-80 min-h-32"}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-foreground font-mono text-sm font-medium">
          Bash
        </span>
        {description && (
          <span className="text-muted-foreground text-sm">{description}</span>
        )}
      </div>

      <div className="bg-card overflow-hidden rounded p-4 font-mono text-xs">
        <div className="text-primary mb-2">$ {command}</div>
        {output && (
          <div className="text-card-foreground whitespace-pre-wrap">
            {output}
          </div>
        )}
      </div>
    </div>
  )
}
