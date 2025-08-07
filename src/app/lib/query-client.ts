import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import SuperJSON from "superjson"

import { createIDBPersister } from "./idb-persister"

let queryClient: QueryClient | undefined = undefined

export const persister = createIDBPersister()

export function getQueryClient() {
  if (!queryClient) queryClient = createQueryClient()
  return queryClient
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
        gcTime: 1000 * 60 * 60 * 24, // 24 hours
      },
      dehydrate: {
        serializeData: SuperJSON.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
      hydrate: {
        deserializeData: SuperJSON.deserialize,
      },
    },
  })
}
