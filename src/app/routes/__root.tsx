import { QueryClient } from "@tanstack/react-query"
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client"
import {
  createRootRouteWithContext,
  Outlet,
} from "@tanstack/react-router"

import { CommandMenu } from "@/app/components/command-menu"
import { FloatingSidebarTrigger } from "@/app/components/floating-sidebar-trigger"
import { ThemeProvider } from "@/app/components/providers/theme.provider"
import { AppSidebar } from "@/app/components/sidebar"
import { Titlebar } from "@/app/components/titlebar"
import { SidebarProvider } from "@/app/components/ui/sidebar"
import { Toaster } from "@/app/components/ui/sonner"
import { api } from "@/app/lib/api"
import { getQueryClient, persister } from "@/app/lib/query-client"
import { KeybindProvider } from "../components/providers/keybind.provider"
import { RegistryProvider } from "../components/providers/registry.provider"

export interface RouterContext {
  queryClient: QueryClient
  api: typeof api
}

export const Route = createRootRouteWithContext<RouterContext>()({
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
        <KeybindProvider>
          <RegistryProvider>
            <SidebarProvider
              style={
                {
                  "--sidebar-width": "17rem",
                  "--sidebar-width-icon": "3rem",
                } as React.CSSProperties
              }
            >
              <RootDocument />
            </SidebarProvider>
          </RegistryProvider>
        </KeybindProvider>
      </ThemeProvider>
    </PersistQueryClientProvider>
  )
}

function RootDocument() {
  return (
    <>
      <div className="flex h-screen w-full flex-col">
        <Titlebar />
        <div className="flex min-h-0 flex-1 flex-row">
          <AppSidebar />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
      <CommandMenu />
      <FloatingSidebarTrigger />
      <Toaster position="top-right" />
    </>
  )
}
