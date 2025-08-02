import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"

export const configRouter = {
  get: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.config.get()
    return response.data
  }),

  providers: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.config.providers()
    return response.data
  }),
} satisfies TRPCRouterRecord
