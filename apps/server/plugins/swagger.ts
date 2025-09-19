'use strict';

import type { FastifyInstance } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export default fp(async function (fastify: FastifyInstance) {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'The last of Guss OpenAPI Documentation',
        version: '3.0.1',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'Websocket', description: 'WebSocket endpoints' },
        { name: 'Auth', description: 'Authentication processes' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            description:
              'Provide an accessToken to request a secured api endpoints',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Bearer <accessToken>',
            in: 'header',
          },
        },
      },
      security: [
        { bearerAuth: [] },
      ],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here',
      },
    },
  });

  await fastify.register(swaggerUI, {
    routePrefix: '/api/docs',
  });
});
