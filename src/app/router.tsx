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

  return router
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
