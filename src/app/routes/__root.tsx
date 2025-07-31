import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"

import { KeybindsProvider } from "@/app/components/providers/keybinds.provider"
import { ThemeProvider } from "@/app/components/providers/theme.provider"
import { AppSidebar } from "@/app/components/sidebar"
import { Titlebar } from "@/app/components/titlebar"
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { CommandMenu } from "../components/command-menu"
import { FloatingSidebarTrigger } from "../components/floating-sidebar-trigger"
import { getQueryClient } from "../lib/query-client"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <KeybindsProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "15.5rem",
                "--sidebar-width-icon": "3rem",
              } as React.CSSProperties
            }
          >
            <RootDocument />
          </SidebarProvider>
        </KeybindsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

function RootDocument() {
  return (
    <>
      <div className="h-screen w-full">
        <div className="flex flex-row">
          <Titlebar />
          <AppSidebar />
          <Outlet />
        </div>
      </div>
      <CommandMenu />
      <FloatingSidebarTrigger />
    </>
  )
}
