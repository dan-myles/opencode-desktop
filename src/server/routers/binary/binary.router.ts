import type { TRPCRouterRecord } from "@trpc/server"
import { publicProcedure } from "@/server/trpc"
import { startServer, stopServer } from "./binary.mutations"
import { getBinaryInfo, getServerStatus } from "./binary.queries"
import { startSchema } from "./types"

export const binaryRouter = {
  path: publicProcedure.query(() => {
    return getBinaryInfo()
  }),

  start: publicProcedure.input(startSchema).mutation(async ({ input }) => {
    return await startServer(input)
  }),

  stop: publicProcedure.mutation(() => {
    return stopServer()
  }),

  status: publicProcedure.query(() => {
    return getServerStatus()
  }),
} satisfies TRPCRouterRecord
