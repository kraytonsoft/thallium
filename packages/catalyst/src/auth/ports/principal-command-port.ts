import { PrincipalResult } from './principal-result.js';
import { CreateForEntityInput } from './create-principal-input.js';

export interface PrincipalCommandPort {
  createForEntityId(entityId: string, input: CreateForEntityInput): Promise<PrincipalResult>;
  removePrincipalById(principalId: string): Promise<void>;
}

