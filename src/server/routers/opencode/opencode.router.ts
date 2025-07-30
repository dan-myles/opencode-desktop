import { z } from "zod"
import type { TRPCRouterRecord } from "@trpc/server"
import { publicProcedure } from "../../trpc"
import { getBinaryInfo, getServerStatus } from "./opencode.queries"
import { startServer, stopServer } from "./opencode.mutations"

export const opencodeRouter = {
  getBinaryPath: publicProcedure.query(() => {
    return getBinaryInfo()
  }),

  startServer: publicProcedure
    .input(
      z.object({
        port: z.number().optional().default(3000),
        host: z.string().optional().default("localhost"),
      }),
    )
    .mutation(async ({ input }) => {
      return await startServer(input)
    }),

  stopServer: publicProcedure.mutation(() => {
    return stopServer()
  }),

  getServerStatus: publicProcedure.query(() => {
    return getServerStatus()
  }),
} satisfies TRPCRouterRecord
