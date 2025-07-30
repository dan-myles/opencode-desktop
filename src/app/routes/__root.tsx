import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { APIProvider } from "../components/providers/api.provider"
import { ThemeProvider } from "../components/providers/theme.provider"
import { Titlebar } from "../components/titlebar"

export const Route = createRootRoute({
  component: () => (
    <>
      <ThemeProvider>
        <APIProvider>
          <Titlebar />
          <Outlet />
          <TanStackRouterDevtools />
        </APIProvider>
      </ThemeProvider>
    </>
  ),
})
