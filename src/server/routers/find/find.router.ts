import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { findFilesSchema, findSymbolsSchema, findTextSchema } from "./types"

export const findRouter = {
  text: serverProcedure.input(findTextSchema).query(async ({ input, ctx }) => {
    const response = await ctx.client.find.text({
      query: { pattern: input.pattern },
    })
    return response.data
  }),

  files: serverProcedure
    .input(findFilesSchema)
    .query(async ({ input, ctx }) => {
      const response = await ctx.client.find.files({
        query: { query: input.query },
      })
      return response.data
    }),

  symbols: serverProcedure
    .input(findSymbolsSchema)
    .query(async ({ input, ctx }) => {
      const response = await ctx.client.find.symbols({
        query: { query: input.query },
      })
      return response.data
    }),
} satisfies TRPCRouterRecord
