import { z } from "zod"

import type { TRPCRouterRecord } from "@trpc/server"
import { publicProcedure } from "../trpc"

export const opencodeRouter = {
  binaryPath: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(({ input }) => {
      return `Hello ${input.name}`
    }),
} satisfies TRPCRouterRecord
