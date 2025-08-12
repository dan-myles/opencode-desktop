import { createCollection } from "@tanstack/db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { trpcClient } from "@/app/lib/api"
import { getQueryClient } from "../lib/query-client"

export type MessageWithParts = {
  info: Message
  parts: Part[]
}

const queryClient = getQueryClient()

function createSessionMessageCollection(sessionId: string) {
  return createCollection(
    queryCollectionOptions({
      queryKey: ["messages", sessionId],
      getKey: (item) => item.info.id,
      queryFn: async () => {
        const messages = await trpcClient.session.messages.query({
          id: sessionId,
        })
        return messages as MessageWithParts[]
      },
      // TODO: Fix this!
      // @ts-expect-error hydration type mismatch ??
      queryClient,
    }),
  )
}

class MessageCollectionManager {
  private collections = new Map<
    string,
    ReturnType<typeof createSessionMessageCollection>
  >()

  getSessionCollection(sessionId: string) {
    if (!this.collections.has(sessionId)) {
      this.collections.set(sessionId, createSessionMessageCollection(sessionId))
    }
    return this.collections.get(sessionId)!
  }

  cleanupSession(sessionId: string) {
    const collection = this.collections.get(sessionId)
    if (collection) {
      collection.cleanup()
      this.collections.delete(sessionId)
    }
  }
}

export const messageManager = new MessageCollectionManager()
