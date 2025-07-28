import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools"

import { Titlebar } from "../components/titlebar"

export const Route = createRootRoute({
  component: () => (
    <>
      <Titlebar />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
