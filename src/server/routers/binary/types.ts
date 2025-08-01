import z from "zod"

export const startSchema = z.object({
  port: z.optional(z.number()).default(4096),
  host: z.optional(z.string()).default("localhost"),
})
export type StartMutation = z.infer<typeof startSchema>
