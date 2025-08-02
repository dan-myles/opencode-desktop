import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { fileReadSchema } from "./types"

export const fileRouter = {
  read: serverProcedure.input(fileReadSchema).query(async ({ input, ctx }) => {
    const response = await ctx.client.file.read({ query: { path: input.path } })
    return response.data
  }),

  status: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.file.status()
    return response.data
  }),
} satisfies TRPCRouterRecord
