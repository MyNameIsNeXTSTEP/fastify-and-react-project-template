'use strict';

import type { WebSocket } from 'ws';
import type { FastifyRequest, FastifyInstance } from 'fastify';
import { type TSignupFormBody } from '@shared/api/v1/schemas/ws/auth/signup/types/signupBody';

const signup = (fastify: FastifyInstance) =>
  async (data: { params: TSignupFormBody }, socket: WebSocket, request: FastifyRequest) => {
    const { firstName, lastName, email, password, role } = data.params;
    return {
      code: 200,
      result: {
        firstName,
        lastName,
        email,
        password,
        role,
      },
    };
  };

export default signup;
