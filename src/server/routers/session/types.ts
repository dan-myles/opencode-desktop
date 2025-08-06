import { z } from "zod"

// Minimal Zod schemas for tRPC input validation only
export const sessionIdSchema = z.object({
  id: z.string(),
})

export const sessionMessageSchema = z.object({
  id: z.string(),
  messageID: z.string(),
})

export const sessionInitInputSchema = z.object({
  id: z.string(),
  messageID: z.string(),
  providerID: z.string(),
  modelID: z.string(),
})

export const sessionChatInputSchema = z.object({
  id: z.string(),
  messageID: z.string().regex(/^msg/).optional(),
  providerID: z.string(),
  modelID: z.string(),
  mode: z.string().optional(),
  system: z.string().optional(),
  tools: z.record(z.string(), z.boolean()).optional(),
  parts: z.array(
    z.union([
      z.object({
        type: z.literal("text"),
        text: z.string(),
        synthetic: z.boolean().optional(),
        time: z
          .object({
            start: z.number(),
            end: z.number().optional(),
          })
          .optional(),
      }),
      z.object({
        type: z.literal("file"),
        mime: z.string(),
        url: z.string(),
        filename: z.string().optional(),
        source: z.any().optional(),
      }),
    ]),
  ),
})

export const sessionSummarizeInputSchema = z.object({
  id: z.string(),
  providerID: z.string(),
  modelID: z.string(),
})

export const sessionRevertInputSchema = z.object({
  id: z.string(),
  messageID: z.string().regex(/^msg/),
  partID: z.string().regex(/^prt/).optional(),
})

export const permissionResponseInputSchema = z.object({
  id: z.string(),
  permissionID: z.string(),
  response: z.enum(["once", "always", "reject"]),
})

// Inferred input types for tRPC procedures
export type SessionIdInput = z.infer<typeof sessionIdSchema>
export type SessionMessageInput = z.infer<typeof sessionMessageSchema>
export type SessionInitInput = z.infer<typeof sessionInitInputSchema>
export type SessionChatInput = z.infer<typeof sessionChatInputSchema>
export type SessionSummarizeInput = z.infer<typeof sessionSummarizeInputSchema>
export type SessionRevertInput = z.infer<typeof sessionRevertInputSchema>
export type PermissionResponseInput = z.infer<
  typeof permissionResponseInputSchema
>
