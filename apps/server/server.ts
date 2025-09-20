'use strict';

import Fastify, { type FastifyInstance } from 'fastify';
import autoload from '@fastify/autoload';
import fastifyFormbody from '@fastify/formbody';
import fastifyCors from '@fastify/cors';
import fastifyWebsocket from '@fastify/websocket';
import { wsRegistry, wsSchemaValidator } from './plugins/ws-api/index.js';
import { registerRoutes } from './routes/index.js';
import { config } from 'dotenv';
import fastifyCookie from '@fastify/cookie';
import { connectDB, closeDB } from './db/connection.js';
import { __dirname } from '../../system.js';
import * as path from 'path';

config({ path: path.join(__dirname, '.env') });
const port = Number(process.env.SERVER_PORT) || 3000;

const buildServer = async (): Promise<FastifyInstance> => {
  const fastify = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    disableRequestLogging: process.env.DISABLE_REQUEST_LOGGING === 'true',
    ajv: {
      customOptions: {
        removeAdditional: false,
        useDefaults: true,
        coerceTypes: true,
        allErrors: true,
      },
    },
  });

  try {
    await connectDB();
    fastify.log.info('Server: Database connected successfully');
  } catch (error: any) {
    fastify.log.error('Server: Failed to connect to database:', error);
    throw error;
  }

  /**
   * @Note
   * Логирует пока только ошибки (использовать для дева, в проде логировать все запросы http и ws, кроме медиа)
   */
  if (process.env.LOG_ONLY_ERRORS === 'true') {
    fastify.addHook('onError', async (request, reply, error) => {
      request.log.error({
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        headers: request.headers,
        error, 
      }, 'request error occurred');
    });
  }

  await fastify.register(autoload, {
    dir: path.join(__dirname, '/apps/server/plugins'),
  });
  await fastify.register(fastifyFormbody);
  await fastify.register(wsRegistry);
  await fastify.register(wsSchemaValidator);
  await fastify.register(fastifyWebsocket);
  await fastify.register(fastifyCors);
  fastify.register(registerRoutes, {
    prefix: '/api',
  });
  await fastify.register(fastifyCookie as any, {
    secret: 'a-secret-for-signing-cookies',
    hook: 'onRequest',
  });
  // fastify.decorate('db', db);
  // fastify.decorate('session', session);
  // fastify.decorate('account', account);
  return fastify as FastifyInstance;
};

const startServer = async () => {
  const server = await buildServer();
  try {
    await server.listen({
      port,
      host: '0.0.0.0',
    });
    process.on('SIGINT', async () => {
      console.warn('\nClosing the server by a SIGINT\n');
      await closeDB();
      await server.close();
      process.exit(0);
    });
    process.on('SIGTERM', async () => {
      console.warn('\nClosing the server by a SIGTERM\n');
      await closeDB();
      await server.close();
      process.exit(1);
    });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

startServer();
