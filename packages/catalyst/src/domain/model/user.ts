import { EntitySchema } from './entity.js';
import { z } from 'zod';

export const UserSchema = EntitySchema.extend({
  email: z.email(),
  attrs: z.record(z.string(), z.any()).default({}),
  createdAt: z.date().nullish()
})
export type UserType = z.infer<typeof UserSchema>
