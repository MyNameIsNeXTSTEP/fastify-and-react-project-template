'use strict';

import type { FastifyInstance } from 'fastify';
import { wsV1Routes } from './ws/v1/index.js';

export async function registerRoutes(fastify: FastifyInstance) {
  // WS API
  await fastify.register(wsV1Routes);
};
