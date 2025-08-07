import { del, get, set } from "idb-keyval"

import type {
  PersistedClient,
  Persister,
} from "@tanstack/react-query-persist-client"

const IDB_KEY = "opencode-query-cache"

export function createIDBPersister() {
  return {
    persistClient: async (client: PersistedClient) => {
      await set(IDB_KEY, client)
    },
    restoreClient: async () => {
      return await get<PersistedClient>(IDB_KEY)
    },
    removeClient: async () => {
      await del(IDB_KEY)
    },
  } satisfies Persister
}
