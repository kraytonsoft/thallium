import { PrincipalQueryPort } from '../../auth/index.js';
import { TokenResult } from '../../auth/index.js';
import { SecurityPort } from '../../auth/index.js';
import { Duration } from '../../domain/model/duration.js';
import AuthError from '../../auth/errors/auth-error.js';
import { AuthErrorCodesEnum } from '../../auth/errors/auth-error-codes-enum.js';
import {isNil} from "lodash"
import { PrincipalTypeEnum } from '../../auth/model/principal-type-enum.js';

export default class LoginWithAppleProviderHandler {
  public constructor(
    private readonly query: PrincipalQueryPort,
    private readonly securityPort: SecurityPort
  ) {
  }

  public async loginWithAppleProvider(_provider: PrincipalTypeEnum.google | PrincipalTypeEnum.apple, uid: string, ttl: Duration): Promise<TokenResult> {
    // TODO: Separate logic for apple and for google
    const principal = await this.query.findPrincipalByUid(uid);
    if(isNil(principal)) {
      throw new AuthError(AuthErrorCodesEnum.missingPrincipal);
    }
    const tokens = await this.securityPort.generateJwtTokenForEntityId(principal.entityId, ttl)
    return tokens;
  }
}
