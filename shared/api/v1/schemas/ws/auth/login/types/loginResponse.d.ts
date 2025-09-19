export interface TokenOptions {
  value: string,
  secure: boolean,
  expires: string,
}

export interface LoginResult {
  accountId: number
}

export interface LoginResponse {
  result: LoginResult,
  cookies: {
    accessToken: TokenOptions,
    refreshToken: TokenOptions,
  },
};
