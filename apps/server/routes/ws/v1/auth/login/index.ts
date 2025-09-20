'use strict';

import type { WebSocket } from 'ws';
import { type FastifyRequest, type FastifyInstance } from 'fastify';
import { type LoginBody } from '@shared/api/v1/schemas/ws/auth/login/types/loginBody';

const login = (fastify: FastifyInstance) => 
  async(data: { params: LoginBody }, socket: WebSocket, request: FastifyRequest) => {
    const { email, password } = data.params;
    return {
      code: 200,
      data: {
        email,
        password,
      },
    };
  };

export default login;
