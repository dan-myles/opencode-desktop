// TODO: Manually write types for missing ANY's
/* eslint-disable @typescript-eslint/no-explicit-any */

import { z } from "zod"

// Request schemas
export const sessionIdSchema = z.object({
  id: z.string(),
})

export const sessionMessageSchema = z.object({
  id: z.string(),
  messageID: z.string(),
})

export const sessionInitSchema = z.object({
  id: z.string(),
  messageID: z.string(),
  providerID: z.string(),
  modelID: z.string(),
})

export const sessionChatSchema = z.object({
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

export const sessionSummarizeSchema = z.object({
  id: z.string(),
  providerID: z.string(),
  modelID: z.string(),
})

export const sessionRevertSchema = z.object({
  id: z.string(),
  messageID: z.string().regex(/^msg/),
  partID: z.string().regex(/^prt/).optional(),
})

export const permissionResponseSchema = z.object({
  id: z.string(),
  permissionID: z.string(),
  response: z.enum(["once", "always", "reject"]),
})

// Type exports
export type SessionId = z.infer<typeof sessionIdSchema>
export type SessionMessage = z.infer<typeof sessionMessageSchema>
export type SessionInit = z.infer<typeof sessionInitSchema>
export type SessionChat = z.infer<typeof sessionChatSchema>
export type SessionSummarize = z.infer<typeof sessionSummarizeSchema>
export type SessionRevert = z.infer<typeof sessionRevertSchema>
export type PermissionResponse = z.infer<typeof permissionResponseSchema>

// Response types from OpenAPI
export type Session = {
  id: string
  parentID?: string
  share?: { url: string }
  title: string
  version: string
  time: {
    created: number
    updated: number
  }
  revert?: {
    messageID: string
    partID?: string
    snapshot?: string
    diff?: string
  }
}

export type Message = UserMessage | AssistantMessage

export type UserMessage = {
  id: string
  sessionID: string
  role: "user"
  time: { created: number }
}

export type AssistantMessage = {
  id: string
  sessionID: string
  role: "assistant"
  time: { created: number; completed?: number }
  error?: any
  system: string[]
  modelID: string
  providerID: string
  mode: string
  path: { cwd: string; root: string }
  summary?: boolean
  cost: number
  tokens: {
    input: number
    output: number
    reasoning: number
    cache: { read: number; write: number }
  }
}

export type Part = {
  id: string
  sessionID: string
  messageID: string
  type: string
  [key: string]: any
}

export type MessageWithParts = {
  info: Message
  parts: Part[]
}
