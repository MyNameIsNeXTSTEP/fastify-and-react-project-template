import type { LoginBody, LoginResponse } from '@shared/api/v1/schemas/ws/auth/login/types';
import type { ISignupBody, SignupResponse } from '@shared/api/v1/schemas/ws/auth/signup/types';

declare module "*.svg" {
  const content: string;
  export default content;
}

declare global {
  namespace api {
    namespace auth {
      function login(params: LoginBody): Promise<LoginResponse>;
      function signup(params: ISignupBody): Promise<SignupResponse>;
    }
  }

  namespace wsApi {
    type WSParams = Record<string, object> | undefined;

    interface WSMessage {
      id: number;
      type: string;
      method: string;
      params?: WSParams;
      token: string;
    }

    interface WSResponse {
      id: number;
      data?: Record<string, object> | string | string[] | number;
      cookies?: Record<string, object>;
      error?: {
        code: number;
        message: string;
      };
    }
    interface WSMessageSchema {
      request: object;
      response: object;
    }
  }
}

export {};
