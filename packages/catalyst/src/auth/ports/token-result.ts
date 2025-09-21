import { z } from 'zod';

export const TokenResultSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number(),
})
export type TokenResult = z.infer<typeof TokenResultSchema>
