import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister"
import { defaultShouldDehydrateQuery, QueryClient } from "@tanstack/react-query"
import SuperJSON from "superjson"

let queryClient: QueryClient | undefined = undefined

export const persister = createAsyncStoragePersister({
  storage: window.localStorage,
})

export function getQueryClient() {
  if (!queryClient) queryClient = createQueryClient()
  return queryClient
}

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000 * 5,
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
