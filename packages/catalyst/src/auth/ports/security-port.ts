import { TokenResult } from './token-result.js';
import { Duration } from '../../domain/model/duration.js';

export interface SecurityPort {
  generateJwtTokenForEntityId(entityId: string, ttl: Duration): Promise<TokenResult>;
  validateJwtToken(token: string): Promise<boolean>;
  validatePassword(password: string, passwordHash: string): Promise<boolean>;
}
