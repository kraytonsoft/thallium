// Range 000 - 999
export enum AuthErrorCodesEnum {
  missingPrincipal = "001",
  badPassword = "002",
}

export const authErrorCodeToMessage: Record<AuthErrorCodesEnum, string> = {
  [AuthErrorCodesEnum.missingPrincipal]: "Missing Principal",
  [AuthErrorCodesEnum.badPassword]: "Bad password",
}
