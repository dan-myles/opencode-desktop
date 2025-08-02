import { z } from "zod"

// Request schemas
export const findTextSchema = z.object({
  pattern: z.string(),
})

export const findFilesSchema = z.object({
  query: z.string(),
})

export const findSymbolsSchema = z.object({
  query: z.string(),
})

// Type exports
export type FindText = z.infer<typeof findTextSchema>
export type FindFiles = z.infer<typeof findFilesSchema>
export type FindSymbols = z.infer<typeof findSymbolsSchema>

// Response types from OpenAPI
export type TextMatch = {
  path: {
    text: string
  }
  lines: {
    text: string
  }
  line_number: number
  absolute_offset: number
  submatches: Array<{
    match: {
      text: string
    }
    start: number
    end: number
  }>
}

export type Symbol = {
  name: string
  kind: number
  location: {
    uri: string
    range: {
      start: {
        line: number
        character: number
      }
      end: {
        line: number
        character: number
      }
    }
  }
}
