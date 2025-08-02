import { z } from "zod"

// Request schemas
export const appendPromptSchema = z.object({
  text: z.string(),
})

export const executeCommandSchema = z.object({
  command: z.string(),
})

// Type exports
export type AppendPrompt = z.infer<typeof appendPromptSchema>
export type ExecuteCommand = z.infer<typeof executeCommandSchema>
