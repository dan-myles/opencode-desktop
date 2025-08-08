import { observable } from "@trpc/server/observable"

import type { Event } from "@/server/sdk/gen/types.gen"
import type { TRPCRouterRecord } from "@trpc/server"
import { serverProcedure } from "@/server/trpc"
import { sseService } from "./services/sse.service"
import {
  permissionResponseInputSchema,
  sessionChatInputSchema,
  sessionIdSchema,
  sessionInitInputSchema,
  sessionMessageSchema,
  sessionRevertInputSchema,
  sessionSummarizeInputSchema,
} from "./types"

export const sessionRouter = {
  list: serverProcedure.query(async ({ ctx }) => {
    const response = await ctx.client.session.list()
    return response.data ?? []
  }),

  get: serverProcedure.input(sessionIdSchema).query(async ({ input, ctx }) => {
    const sessions = await ctx.client.session.list()
    return sessions.data?.find((session) => session.id === input.id)
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
      return response.data ?? false
    }),

  init: serverProcedure
    .input(sessionInitInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.init({
        path: { id },
        body,
      })
      return response.data ?? false
    }),

  messages: serverProcedure
    .input(sessionIdSchema)
    .query(async ({ input, ctx }) => {
      const response = await ctx.client.session.messages({
        path: { id: input.id },
      })
      return response.data ?? []
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
    .input(sessionChatInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.chat({
        path: { id },
        body,
      })
      return response.data
    }),

  abort: serverProcedure
    .input(sessionIdSchema)
    .mutation(async ({ input, ctx }) => {
      const response = await ctx.client.session.abort({
        path: { id: input.id },
      })
      return response.data ?? false
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
    .input(sessionSummarizeInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.summarize({
        path: { id },
        body,
      })
      return response.data ?? false
    }),

  revert: serverProcedure
    .input(sessionRevertInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...body } = input
      const response = await ctx.client.session.revert({
        path: { id },
        body,
      })
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
    .input(permissionResponseInputSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, permissionID, ...body } = input
      const response =
        await ctx.client.postSessionByIdPermissionsByPermissionId({
          path: { id, permissionID },
          body,
        })
      return response.data ?? false
    }),

  subscribeLiveMessages: serverProcedure
    .input(sessionIdSchema)
    .subscription(({ input }) => {
      return observable((emit) => {
        function onMessage(event: Event) {
          if (
            event.type === "message.updated" ||
            event.type === "message.part.updated"
          ) {
            emit.next({
              type: event.type,
              sessionId: input.id,
              data: event.properties,
              timestamp: new Date().toISOString(),
            })
          }
        }

        sseService.on(`session:${input.id}:message`, onMessage)

        return () => {
          sseService.off(`session:${input.id}:message`, onMessage)
        }
      })
    }),

  test: serverProcedure.mutation(async ({ ctx: _ctx }) => {
    // ctx.client.session.chat({
    //
    // })

    sseService.lol()
  }),
} satisfies TRPCRouterRecord
