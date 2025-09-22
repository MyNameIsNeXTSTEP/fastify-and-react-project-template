import type { TRoles } from "@shared/lib";

export interface ISignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: TRoles;
}

export type TSignupFormBody = ISignupBody;

export interface SignupResult {
  accountId: number;
  profileId: number;
  role: string | null;
}

export interface SignupResponse {
  accessToken: string;
  refreshToken: string;
  result: SignupResult;
}
