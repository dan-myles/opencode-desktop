import { createFileRoute } from "@tanstack/react-router"

import { AppearanceSection } from "./-components/appearance-section"
import { DeveloperSection } from "./-components/developer-section"
import { KeybindsSection } from "./-components/keybinds-section"

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <AppearanceSection />
      <KeybindsSection />
      <DeveloperSection />
    </div>
  )
}
