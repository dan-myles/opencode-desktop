import { createCollection } from "@tanstack/db"
import { queryCollectionOptions } from "@tanstack/query-db-collection"

import type { Message, Part } from "@/server/sdk/gen/types.gen"
import { trpcClient } from "@/app/lib/api"
import { getQueryClient } from "../lib/query-client"

type MessageWithParts = {
  info: Message
  parts: Part[]
}

export type MessageCollectionItem = {
  id: string
  sessionId: string
  message: Message
  parts: Part[]
  updatedAt: number
}

function transformMessagesToItems(
  messages: MessageWithParts[],
): MessageCollectionItem[] {
  return messages.map(({ info, parts }) => ({
    id: info.id,
    sessionId: info.sessionID,
    message: info,
    parts: parts,
    updatedAt: Date.now(),
  }))
}

const queryClient = getQueryClient()

export const messageCollection = createCollection(
  queryCollectionOptions({
    queryKey: ["messages"],
    queryFn: async () => {
      const messages = await trpcClient.session.messages.query({ id: "lol" })
      return transformMessagesToItems(messages as MessageWithParts[])
    },
    // TODO: Fix this!
    // @ts-expect-error hydration type mismatch ??
    queryClient,
  }),
)

// export const messageCollectionHelpers = {
//   getSessionMessages: (sessionId: string) =>
//     messageCollection.findMany({
//       where: { sessionId },
//       orderBy: { updatedAt: "asc" },
//     }),
//
//   updateMessage: (messageId: string, updates: Partial<MessageCollectionItem>) =>
//     messageCollection.updateOne({
//       where: { id: messageId },
//       data: { ...updates, updatedAt: Date.now() },
//     }),
//
//   updateMessagePart: (messageId: string, part: Part) =>
//     messageCollection.updateOne({
//       where: { id: messageId },
//       data: (current) => ({
//         ...current,
//         parts: [...current.parts.filter((p) => p.id !== part.id), part].sort(
//           (a, b) => {
//             if (
//               a.type === "text" &&
//               b.type === "text" &&
//               "time" in a &&
//               "time" in b &&
//               a.time &&
//               b.time
//             ) {
//               return a.time.start - b.time.start
//             }
//             if (a.type === "step-start" && b.type !== "step-start") return -1
//             if (b.type === "step-start" && a.type !== "step-start") return 1
//             return a.id.localeCompare(b.id)
//           },
//         ),
//         updatedAt: Date.now(),
//       }),
//     }),
//
//   removeMessage: (messageId: string) =>
//     messageCollection.deleteOne({ where: { id: messageId } }),
//
//   removeMessagePart: (messageId: string, partId: string) =>
//     messageCollection.updateOne({
//       where: { id: messageId },
//       data: (current) => ({
//         ...current,
//         parts: current.parts.filter((p) => p.id !== partId),
//         updatedAt: Date.now(),
//       }),
//     }),
// }
//
