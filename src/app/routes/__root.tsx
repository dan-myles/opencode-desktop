import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { APIProvider } from "../components/providers/api.provider"
import { ThemeProvider } from "../components/providers/theme.provider"
import { AppSidebar } from "../components/sidebar"
import { Titlebar } from "../components/titlebar"
import { SidebarProvider, SidebarInset } from "../components/ui/sidebar"

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider defaultTheme="dark">
        <APIProvider>
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
        </APIProvider>
      </ThemeProvider>
    </>
  ),
})
