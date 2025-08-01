import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { useRegisterKeybind } from "@/app/hooks/use-register-keybind"
import { AppearanceSection } from "./-components/appearance-section"
import { DeveloperSection } from "./-components/developer-section"
import { KeybindsSection } from "./-components/keybinds-section"

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  // useRegisterKeybind({
  //   id: "navigate-settings",
  //   darwinKey: "cmd+,",
  //   win32Key: "ctrl+,",
  //   linuxKey: "ctrl+,",
  //   callback: () => navigate({ to: "/settings", viewTransition: true }),
  //   description: "Open settings",
  // })

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
