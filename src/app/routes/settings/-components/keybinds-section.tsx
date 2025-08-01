import { Keyboard } from "lucide-react"

import type { Keybind } from "@/app/stores/keybind/types"
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
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table"
import { formatKeybindForDisplay } from "@/app/lib/utils"
import { useKeybindList } from "@/app/stores/keybind/store"

interface GroupedKeybinds {
  [category: string]: Keybind[]
}

function groupKeybindsByCategory(keybinds: Keybind[]): GroupedKeybinds {
  const groups: GroupedKeybinds = {}

  keybinds.forEach((keybind) => {
    let category = "General"

    if (keybind.id.includes("sidebar") || keybind.id.includes("command-menu")) {
      category = "Navigation"
    } else if (keybind.id.includes("mode") || keybind.id.includes("theme")) {
      category = "UI Controls"
    } else if (keybind.id.includes("settings")) {
      category = "Settings"
    }

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
    case "Navigation":
      return "default"
    case "UI Controls":
      return "secondary"
    case "Settings":
      return "outline"
    default:
      return "outline"
  }
}

export function KeybindsSection() {
  const keybinds = useKeybindList()
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
              {Object.entries(groupedKeybinds).map(
                ([category, categoryKeybinds]) => (
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
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60%]">Description</TableHead>
                          <TableHead className="text-right">Shortcut</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {categoryKeybinds.map((keybind) => (
                          <TableRow key={`${keybind.id}-${keybind.platform}`}>
                            <TableCell className="font-medium">
                              {keybind.description}
                            </TableCell>
                            <TableCell className="text-right">
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {formatKeybindForDisplay(keybind.key)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  )
}

