import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { APIProvider } from "../components/providers/api.provider"
import { ThemeProvider } from "../components/providers/theme.provider"
import { AppSidebar } from "../components/sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "../components/ui/sidebar"

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark">
        <APIProvider>
          <SidebarProvider 
            style={{
              "--sidebar-width": "12rem",
              "--sidebar-width-icon": "2.5rem",
            } as React.CSSProperties}
          >
            <AppSidebar />
            <SidebarInset>
              <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                <SidebarTrigger className="-ml-1" />
              </header>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
          <TanStackRouterDevtools />
        </APIProvider>
      </ThemeProvider>
    </>
  ),
})
