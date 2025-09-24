import { z } from 'zod';

export const EntitySchema = z.object({
  id: z.uuid()
})
export type Entity = z.infer<typeof EntitySchema>
