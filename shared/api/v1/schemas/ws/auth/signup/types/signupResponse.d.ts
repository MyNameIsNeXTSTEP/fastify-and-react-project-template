export interface SignupResult {
  accountId: number;
  profileId: number;
  role: string | null;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  result: SignupResult;
};
