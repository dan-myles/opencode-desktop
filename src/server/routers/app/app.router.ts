import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { logSchema } from "./types"

export const appRouter = {
  get: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.app.get()
    return response.data
  }),

  init: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.app.init()
    return response.data
  }),

  log: serverProcedure.input(logSchema).mutation(async ({ input, ctx }) => {
    const response = await ctx.client.app.log({ body: input })
    return response.data
  }),

  modes: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.app.modes()
    return response.data
  }),
} satisfies TRPCRouterRecord
