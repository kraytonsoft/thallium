import { PrincipalQueryPort } from '../ports/principal-query-port.js';
import { TokenResult } from '../ports/token-result.js';
import { SecurityPort } from '../ports/security-port.js';
import { Duration } from '../../domain/core/duration.js';
import AuthError from '../errors/auth-error.js';
import { AuthErrorCodesEnum } from '../errors/auth-error-codes-enum.js';
import {isNil} from "lodash"

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
