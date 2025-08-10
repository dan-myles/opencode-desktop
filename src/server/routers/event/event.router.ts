import { observable } from "@trpc/server/observable"

import type { Event } from "@/server/sdk/gen/types.gen"
import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { sseService } from "./services/sse.service"

export const eventRouter = {
  subscribe: serverProcedure.subscription(() => {
    return observable<Event>((emit) => {
      function onEvent(event: Event) {
        emit.next(event)
      }

      sseService.on("event", onEvent)

      return () => {
        sseService.off("event", onEvent)
      }
    })
  }),
} satisfies TRPCRouterRecord
