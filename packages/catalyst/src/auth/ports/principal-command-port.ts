import { z } from 'zod';
import { PrincipalTypeEnum } from '../model/principal-type-enum.js';
import { PrincipalResult } from './principal-result.js';

export interface PrincipalCommandPort {
  createForEntityId(entityId: string, command: CreateEmailAndPasswordPrincipalInput | CreatGoogleProviderPrincipalInput | CreateAppleProviderPrincipalInput | ProviderPrincipalInput): Promise<PrincipalResult>;
  removePrincipalById(principalId: string): Promise<void>;
}

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
