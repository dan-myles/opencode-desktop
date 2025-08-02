import { z } from "zod"

// Request schemas
export const fileReadSchema = z.object({
  path: z.string(),
})

// Type exports
export type FileRead = z.infer<typeof fileReadSchema>

// Response types from OpenAPI
export type FileContent = {
  type: "raw" | "patch"
  content: string
}

export type FileStatus = {
  path: string
  added: number
  removed: number
  status: "added" | "deleted" | "modified"
}
