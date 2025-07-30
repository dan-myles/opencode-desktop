import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { api } from "@/app/lib/api"
import { ThemeProvider } from "../components/providers/theme.provider"
import { AppSidebar } from "../components/sidebar"
import { Titlebar } from "../components/titlebar"
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"

interface RouterContext {
  queryClient: QueryClient
  trpcClient: ReturnType<typeof api.createClient>
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  const { queryClient, trpcClient } = Route.useRouteContext()
  
  return (
    <>
      <ThemeProvider defaultTheme="dark">
        <api.Provider client={trpcClient} queryClient={queryClient}>
          <QueryClientProvider client={queryClient}>
            <Titlebar />
            <SidebarProvider 
              defaultOpen={false}
              style={{
                "--sidebar-width": "12rem",
                "--sidebar-width-icon": "5rem",
              } as React.CSSProperties}
            >
              <AppSidebar />
              <SidebarInset>
                <div className="flex flex-1 flex-col gap-4 p-4 pt-12">
                  <Outlet />
                </div>
              </SidebarInset>
            </SidebarProvider>
            <TanStackRouterDevtools />
          </QueryClientProvider>
        </api.Provider>
      </ThemeProvider>
    </>
  )
}
