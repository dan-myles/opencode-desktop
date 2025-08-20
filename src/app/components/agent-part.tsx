import { Settings, Wrench } from "lucide-react"

interface AgentPartProps {
  part: {
    type: "agent"
    name: string
    source?: {
      value: string
      start: number
      end: number
    }
  }
}

export function AgentPart({ part }: AgentPartProps) {
  const toTitleCase = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

  const getAgentIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case "build":
        return <Wrench className="h-3 w-3" />
      case "plan":
        return <Settings className="h-3 w-3" />
      default:
        return <Settings className="h-3 w-3" />
    }
  }

  const getAgentColor = (name: string) => {
    switch (name.toLowerCase()) {
      case "build":
        return "text-chart-2 border-chart-2/20 bg-chart-2/5"
      case "plan":
        return "text-chart-1 border-chart-1/20 bg-chart-1/5"
      default:
        return "text-chart-3 border-chart-3/20 bg-chart-3/5"
    }
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm
        ${getAgentColor(part.name)}`}
    >
      {getAgentIcon(part.name)}
      <span>Switched to {toTitleCase(part.name)} agent</span>
      {part.source && (
        <span className="text-xs opacity-70">({part.source.value})</span>
      )}
    </div>
  )
}
