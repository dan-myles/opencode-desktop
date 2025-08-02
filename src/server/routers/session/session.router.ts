import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import {
  permissionResponseSchema,
  sessionChatSchema,
  sessionIdSchema,
  sessionInitSchema,
  sessionMessageSchema,
  sessionRevertSchema,
  sessionSummarizeSchema,
} from "./types"

export const sessionRouter = {
  list: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.session.list()
    return response.data
  }),

  create: serverProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.client.session.create()
    return response.data
  }),

  delete: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.delete({
        path: { id: input.id },
      })
      return response.data
    }),

  init: serverProcedure
    .input(sessionInitSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.init({ path: { id }, body })
      return response.data
    }),

  messages: serverProcedure
    .input(sessionIdSchema)
    .query(async ({ input, ctx }) => {
      const response = await ctx.client.session.messages({
        path: { id: input.id },
      })
      return response.data
    }),

  message: serverProcedure
    .input(sessionMessageSchema)
    .query(async ({ input, ctx }) => {
      const response = await ctx.client.session.message({
        path: { id: input.id, messageID: input.messageID },
      })
      return response.data
    }),

  chat: serverProcedure
    .input(sessionChatSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.chat({ path: { id }, body })
      return response.data
    }),

  abort: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.abort({
        path: { id: input.id },
      })
      return response.data
    }),

  share: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.share({
        path: { id: input.id },
      })
      return response.data
    }),

  unshare: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.unshare({
        path: { id: input.id },
      })
      return response.data
    }),

  summarize: serverProcedure
    .input(sessionSummarizeSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.summarize({
        path: { id },
        body,
      })
      return response.data
    }),

  revert: serverProcedure
    .input(sessionRevertSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.revert({ path: { id }, body })
      return response.data
    }),

  unrevert: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.unrevert({
        path: { id: input.id },
      })
      return response.data
    }),

  respondToPermission: serverProcedure
    .input(permissionResponseSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, permissionID, ...body } = input
      const response =
        await ctx.client.postSessionByIdPermissionsByPermissionId({
          path: { id, permissionID },
          body,
        })
      return response.data
    }),
} satisfies TRPCRouterRecord
