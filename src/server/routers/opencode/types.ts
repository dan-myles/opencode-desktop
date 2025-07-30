import z from "zod"

export const startSchema = z.object({
  port: z.number().optional().default(3000),
  host: z.string().optional().default("localhost"),
})
