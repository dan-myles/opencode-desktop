import { QueryClient } from "@tanstack/react-query"
import { createRouter as createTanStackRouter } from "@tanstack/react-router"

import { api } from "./lib/api"
import { getQueryClient } from "./lib/query-client"
import { routeTree } from "./routeTree.gen"

const queryClient = getQueryClient()

export interface RouterContext {
  queryClient: QueryClient
  api: typeof api
}

export function createRouter() {
  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: "intent",
    context: {
      api,
      queryClient,
    },
  })

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
