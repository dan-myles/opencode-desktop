import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { appendPromptSchema, executeCommandSchema } from "./types"

export const tuiRouter = {
  appendPrompt: serverProcedure
    .input(appendPromptSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.tui.appendPrompt({ body: input })
      return response.data
    }),

  openHelp: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.openHelp()
    return response.data
  }),

  openSessions: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.openSessions()
    return response.data
  }),

  openThemes: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.openThemes()
    return response.data
  }),

  openModels: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.openModels()
    return response.data
  }),

  submitPrompt: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.submitPrompt()
    return response.data
  }),

  clearPrompt: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.tui.clearPrompt()
    return response.data
  }),

  executeCommand: serverProcedure
    .input(executeCommandSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.tui.executeCommand({ body: input })
      return response.data
    }),
} satisfies TRPCRouterRecord
