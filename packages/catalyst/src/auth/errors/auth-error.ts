import CatalystError from '../../domain/errors/catalyst-error.js';
import {
  AuthErrorCodesEnum,
  authErrorCodeToMessage,
} from './auth-error-codes-enum.js';

export default class AuthError extends CatalystError {
  constructor(code: AuthErrorCodesEnum) {
    super(code, authErrorCodeToMessage[code]);
  }
}
