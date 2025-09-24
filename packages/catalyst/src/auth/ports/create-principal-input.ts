import { z } from 'zod';
import { PrincipalTypeEnum } from '../model/principal-type-enum.js';

export const CreateEmailAndPasswordPrincipalInputSchema = z.object({
  type: z.literal(PrincipalTypeEnum.emailAndPassword),
  email: z.email(),
  passwordRaw: z.string(),
})
export type CreateEmailAndPasswordPrincipalInput = z.infer<typeof CreateEmailAndPasswordPrincipalInputSchema>

export const ProviderPrincipalInputSchema = z.object({
  uid: z.string(),
})
export type ProviderPrincipalInput = z.infer<typeof ProviderPrincipalInputSchema>

export const CreateAppleProviderPrincipalInputSchema = ProviderPrincipalInputSchema.extend({
  type: z.literal(PrincipalTypeEnum.apple)
})
export type CreateAppleProviderPrincipalInput = z.infer<typeof CreateAppleProviderPrincipalInputSchema>

export const CreatGoogleProviderPrincipalInputSchema = ProviderPrincipalInputSchema.extend({
  type: z.literal(PrincipalTypeEnum.google)
})
export type CreatGoogleProviderPrincipalInput= z.infer<typeof CreatGoogleProviderPrincipalInputSchema>
export type CreateForEntityInput = CreateEmailAndPasswordPrincipalInput | CreatGoogleProviderPrincipalInput | CreateAppleProviderPrincipalInput | ProviderPrincipalInput
