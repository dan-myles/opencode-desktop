import { z } from "zod"

// Request schemas for tRPC validation
export const logSchema = z.object({
  service: z.string(),
  level: z.enum(["debug", "info", "error", "warn"]),
  message: z.string(),
  extra: z.record(z.string(), z.any()).optional(),
})

export type LogMutation = z.infer<typeof logSchema>
