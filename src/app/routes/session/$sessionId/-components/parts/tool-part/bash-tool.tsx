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
        <span
          className="font-mono text-sm font-medium text-slate-900
            dark:text-slate-100"
        >
          Bash
        </span>
        {description && (
          <span className="text-muted-foreground text-sm">{description}</span>
        )}
      </div>

      <div
        className="overflow-hidden rounded bg-slate-900 p-4 font-mono text-xs
          dark:bg-slate-950"
      >
        <div className="mb-2 text-green-400">$ {command}</div>
        {output && (
          <div className="whitespace-pre-wrap text-slate-300">{output}</div>
        )}
      </div>
    </div>
  )
}
