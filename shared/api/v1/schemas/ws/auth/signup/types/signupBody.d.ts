import type { TRoles } from "@root/shared/lib";

export interface ISignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: TRoles,
}

export type TSignupFormBody = ISignupBody;
