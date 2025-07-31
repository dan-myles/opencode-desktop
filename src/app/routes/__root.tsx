import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { ThemeProvider } from "@/app/components/providers/theme.provider"
import { AppSidebar } from "@/app/components/sidebar"
import { Titlebar } from "@/app/components/titlebar"
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { CommandMenu } from "../components/command-menu"
import { getQueryClient } from "../lib/query-client"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const queryClient = getQueryClient()

  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
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
      <TanStackRouterDevtools position="top-right" />
    </>
  )
}
