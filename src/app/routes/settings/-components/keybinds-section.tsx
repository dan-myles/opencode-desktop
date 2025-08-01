import { Keyboard } from "lucide-react"

import type { Keybind } from "@/app/components/providers/keybind.types"
import { Badge } from "@/app/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/app/components/ui/table"
import { useKeybindList } from "@/app/hooks/use-keybind"
import { formatKeybindForDisplay, getCurrentPlatform } from "@/app/lib/utils"

interface GroupedKeybinds {
  [category: string]: Keybind[]
}

export function KeybindsSection() {
  const keybinds = useKeybindList()
  const platform = getCurrentPlatform()
  const groupedKeybinds = groupKeybindsByCategory(keybinds)

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-2">
        <Keyboard className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Keyboard Shortcuts</h2>
      </div>

      <Card className="bg-background/50">
        <CardHeader>
          <CardTitle>Active Keybinds</CardTitle>
          <CardDescription>
            All registered keyboard shortcuts for the current platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(groupedKeybinds).length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              No keybinds registered
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedKeybinds)
                .sort(([a], [b]) =>
                  a === "General" ? -1 : b === "General" ? 1 : 0,
                )
                .map(([category, categoryKeybinds]) => (
                  <div key={category}>
                    <div className="mb-3 flex items-center gap-2">
                      <h3 className="text-sm font-medium">{category}</h3>
                      <Badge
                        variant={getCategoryColor(category)}
                        className="text-xs"
                      >
                        {categoryKeybinds.length}
                      </Badge>
                    </div>
                    <Table>
                      <TableBody>
                        {categoryKeybinds.map((keybind) => {
                          const platformKey =
                            platform === "linux"
                              ? keybind.keys.linux
                              : platform === "win32"
                                ? keybind.keys.win32
                                : keybind.keys.darwin

                          return (
                            <TableRow key={keybind.id}>
                              <TableCell className="font-medium">
                                {keybind.description}
                              </TableCell>
                              <TableCell className="text-right">
                                <Badge className="font-mono text-xs">
                                  {platformKey
                                    ? formatKeybindForDisplay(platformKey)
                                    : "N/A"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

function groupKeybindsByCategory(keybinds: Keybind[]): GroupedKeybinds {
  const groups: GroupedKeybinds = {}

  keybinds.forEach((keybind) => {
    const category = keybind.id.includes("settings") ? "Settings" : "General"

    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(keybind)
  })

  return groups
}

function getCategoryColor(
  category: string,
): "default" | "secondary" | "outline" {
  switch (category) {
    case "Settings":
      return "outline"
    default:
      return "secondary"
  }
}
