import { createFileRoute, useNavigate } from "@tanstack/react-router"

import { useRegisterKeybind } from "@/app/hooks/use-register-keybind"
import { AppearanceSection } from "./-components/appearance-section"
import { DeveloperSection } from "./-components/developer-section"

export const Route = createFileRoute("/settings/")({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  useRegisterKeybind({
    id: "navigate-settings",
    callback: () => navigate({ to: "/settings", viewTransition: true }),
    description: "Open Settings",
    key: "cmd+,",
    platform: "darwin",
  })

  useRegisterKeybind({
    id: "navigate-settings",
    callback: () => navigate({ to: "/settings", viewTransition: true }),
    description: "Open Settings",
    key: "ctrl+,",
    platform: "win32",
  })

  useRegisterKeybind({
    id: "navigate-settings",
    callback: () => navigate({ to: "/settings", viewTransition: true }),
    description: "Open Settings",
    key: "ctrl+,",
    platform: "linux",
  })

  return (
    <div className="container mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <AppearanceSection />
      <DeveloperSection />
    </div>
  )
}