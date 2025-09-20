'use strict';

import type { FastifyInstance } from 'fastify';
import wsEntryRoute from '../index.js';
import authApi from './auth/index.js';

import loginRequestSchema from '@shared/api/v1/schemas/ws/auth/login/request.schema.js';
import loginResponseSchema from '@shared/api/v1/schemas/ws/auth/login/response.schema.js';

import signupRequestSchema from '@shared/api/v1/schemas/ws/auth/signup/request.schema.js';
import signupResponseSchema from '@shared/api/v1/schemas/ws/auth/signup/response.schema.js';

export async function wsV1Routes(fastify: FastifyInstance) {
  /**
   * AUTH API
   */
  fastify.wsRegistry.register('auth/login', authApi.login(fastify), {
    request: loginRequestSchema,
    response: loginResponseSchema,
  });
  fastify.wsRegistry.register('auth/signup', authApi.signup(fastify), {
    request: signupRequestSchema,
    response: signupResponseSchema,
  });
  /**
   * API ENTRY POINT
   */
  await fastify.register(wsEntryRoute);
};
