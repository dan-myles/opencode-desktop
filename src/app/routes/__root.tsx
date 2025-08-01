import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import { createRootRoute, Outlet } from "@tanstack/react-router"

import { CommandMenu } from "@/app/components/command-menu"
import { FloatingSidebarTrigger } from "@/app/components/floating-sidebar-trigger"
import { KeybindsProvider } from "@/app/components/providers/keybinds.provider"
import { ThemeProvider } from "@/app/components/providers/theme.provider"
import { AppSidebar } from "@/app/components/sidebar"
import { Titlebar } from "@/app/components/titlebar"
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { Toaster } from "@/app/components/ui/sonner"
import { getQueryClient, persister } from "@/app/lib/query-client"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const queryClient = getQueryClient()

  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
    >
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
    </PersistQueryClientProvider>
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
      <Toaster position="top-right" />
    </>
  )
}
