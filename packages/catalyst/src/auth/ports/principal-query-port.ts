import {
  EmailAndPasswordPrincipalResult,
  PrincipalResult,
  UidPrincipalResult,
} from './principal-result.js';
import { Nullish } from '../../domain/types/nullish.js';

export interface PrincipalQueryPort {
  findPrincipalByEmail(email: string): Promise<Nullish<EmailAndPasswordPrincipalResult>>;
  findPrincipalByUid(uid: string): Promise<Nullish<UidPrincipalResult>>;
  findPrincipalsByEntityId(entityId: string): Promise<PrincipalResult[]>;
}
