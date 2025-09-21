import {
  PrincipalQueryPort,
  SecurityPort,
  TokenResult,
} from '../../auth/index.js';
import { Duration } from '../../domain/model/duration.js';
import { isNil } from 'lodash';
import AuthError from '../../auth/errors/auth-error.js';
import { AuthErrorCodesEnum } from '../../auth/errors/auth-error-codes-enum.js';

export default class LoginHandler {
  public constructor(
    private readonly query: PrincipalQueryPort,
    private readonly securityPort: SecurityPort
  ) {
  }

  public async loginWithEmailAndPassword(email: string, password: string, ttl: Duration): Promise<TokenResult> {
    const principal = await this.query.findPrincipalByEmail(email);
    if(isNil(principal)) {
      throw new AuthError(AuthErrorCodesEnum.missingPrincipal);
    }
    const isPasswordValid = this.securityPort.validatePassword(password, principal.passwordHash)
    if(!isPasswordValid) {
      throw new AuthError(AuthErrorCodesEnum.badPassword);
    }
    const tokens = await this.securityPort.generateJwtTokenForEntityId(principal.entityId, ttl)
    return tokens;
  }
}
