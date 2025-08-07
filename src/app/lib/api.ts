import { createTRPCClient } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { ipcLink } from "trpc-electron/renderer"

import type { AppRouter } from "@/server/root"
import { getQueryClient } from "./query-client"

const queryClient = getQueryClient()

export const api = createTRPCOptionsProxy<AppRouter>({
  client: createTRPCClient<AppRouter>({
    links: [ipcLink({})],
  }),
  queryClient,
})
