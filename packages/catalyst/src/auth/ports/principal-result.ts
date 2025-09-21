import { z } from 'zod';
import { PrincipalTypeEnum } from '../model/principal-type-enum.js';

export const PrincipalResultSchema = z.object({
  entityId: z.uuid(),
  type: z.enum(PrincipalTypeEnum),
  attrs: z.record(z.string(), z.any()).default({})
})
export type PrincipalResult = z.infer<typeof PrincipalResultSchema>;

export const EmailAndPasswordPrincipalResultSchema = PrincipalResultSchema.extend({
  email: z.email(),
  passwordHash: z.string(),
})
export type EmailAndPasswordPrincipalResult = z.infer<typeof EmailAndPasswordPrincipalResultSchema>;

export const ProviderUidPrincipalResultSchema = PrincipalResultSchema.extend({
  provider: z.enum(PrincipalTypeEnum),
  uid: z.string(),
})
export const ProviderUidPrincipalAppleResultSchema = ProviderUidPrincipalResultSchema.extend({
  provider: z.literal(PrincipalTypeEnum.apple),
})
export type ProviderUidPrincipalAppleResult = z.infer<typeof ProviderUidPrincipalResultSchema>;
