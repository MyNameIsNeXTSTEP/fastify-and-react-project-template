import type { ERoles } from "@root/shared/lib";

export interface ISignupBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUserRegistrationMeta {
  role: ERoles,
  occupantType?: string,
  unitId?: string,
  unitSerialNumber?: string,
}

export type TSignupFormBody = ISignupBody & IUserRegistrationMeta;
