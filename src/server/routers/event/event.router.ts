import type { TRPCRouterRecord } from "@trpc/server"
import { publicProcedure } from "@/server/trpc"
import { getEventSubscriptionInfo } from "./event.queries"

export const eventRouter = {
  subscribe: publicProcedure.query(() => {
    return getEventSubscriptionInfo()
  }),
} satisfies TRPCRouterRecord
