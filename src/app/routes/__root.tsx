import { QueryClientProvider } from "@tanstack/react-query"
import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"
import { useState, useEffect } from "react"

import { ThemeProvider } from "@/app/components/providers/theme.provider"
import { AppSidebar } from "@/app/components/sidebar"
import { Titlebar } from "@/app/components/titlebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar"
import { getQueryClient } from "../lib/query-client"

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  const queryClient = getQueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RootDocument />
          <TanStackRouterDevtools position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}

function RootDocument() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem("sidebar-open")
    if (saved !== null) {
      setSidebarOpen(JSON.parse(saved))
    }
  }, [])

  const handleOpenChange = (open: boolean) => {
    setSidebarOpen(open)
    localStorage.setItem("sidebar-open", JSON.stringify(open))
  }

  return (
    <>
      <div className="flex h-screen flex-col">
        <div className="flex flex-1 overflow-hidden">
          <SidebarProvider
            open={sidebarOpen}
            onOpenChange={handleOpenChange}
            style={
              {
                "--sidebar-width": "16rem",
                "--sidebar-width-icon": "0rem",
              } as React.CSSProperties
            }
          >
            <Titlebar />
            <AppSidebar />
            <SidebarInset className="flex-1 overflow-auto relative">
              {!sidebarOpen && (
                <SidebarTrigger className="absolute bottom-4 left-4 z-10 animate-in fade-in duration-700" />
              )}
              <div className="flex flex-1 flex-col gap-4 p-4">
                <Outlet />
              </div>
            </SidebarInset>
          </SidebarProvider>
        </div>
      </div>
    </>
  )
}
