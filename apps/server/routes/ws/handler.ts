'use strict';

import { type FastifyRequest, type FastifyInstance } from 'fastify';
import { type WebSocket } from 'ws';
import baseMessageSchema from '@shared/api/v1/schemas/ws/base.schema.js';

const wsEntryPointHandler = (fastify: FastifyInstance) => (socket: WebSocket, request: FastifyRequest) => {
  socket.on('open', () => {
    console.log('WebSocket opened');
    socket.send(JSON.stringify({ ok: true }));
  });
  socket.on('message', async (message) => {
    let data = {} as wsApi.WSMessage;
    try {
      data = JSON.parse(message.toString());
    } catch (err) {
      console.error(err);
      socket.send(JSON.stringify({
        error: {
          code: 400,
          message: 'Invalid JSON',
        },
      }));
      return;
    };
    const logInfo = (...args: unknown[]) => {
      if (data.method.startsWith('chat/')) return;
      console.log(...args);
    };
    logInfo('WebSocket message received:', message.toString());
    
    /**
     * @todo
     * Maybe need to move it to the ws-schema-validator plugin, and refactor this module
     */
    const baseValidation = fastify.validateWSMessage(data, baseMessageSchema);
    if (!baseValidation.valid) {
      socket.send(JSON.stringify({
        id: data.id,
        error: {
          code: 400,
          message: 'Invalid message format',
          details: baseValidation.errors,
        },
      }));
      return;
    }
    
    /**
     * Process `call` api type
     */
    if (data.type === 'call') {
      /**
       * @todo @important
       * Need to use type 'chat' for chat methods and process it separately
       */
      const method = data.method;
      logInfo(`WebSocket API call: ${method}`);
      
      if (!fastify.wsRegistry.has(method)) {
        logInfo(`Method not found: ${method}`);
        socket.send(JSON.stringify({
          id: data.id,
          error: {
            code: 404,
            message: `Method ${method} not found`,
          },
        }));
        return;
      }
      
      logInfo(`Method found, processing: ${method}`);
      
      /**
       * Authenticate if needed, expect the requests for auth/login | auth/signup
       */
      if (!['auth/login', 'auth/signup'].includes(method)) {
        try {
          logInfo(`Authenticating request for method: ${method}`);
          fastify.wsAuth(socket, data.token, request);
          logInfo(`Authentication successful for method: ${method}`);
        } catch (err) {
          console.error(`Authentication failed for method ${method}:`, err);
          socket.send(JSON.stringify({
            id: data.id,
            error: {
              code: 401,
              message: 'Authentication required',
            },
          }));
          return;
        };
      }
      
      logInfo(`Processing method: ${method}`);
      const response = await fastify.wsRegistry.process(data, socket, request);
      logInfo(`Method ${method} response:`, response);
      socket.send(JSON.stringify(response));
    }
  });
  
  socket.on('close', (code) => {
    fastify.log.info('WS API connection closed');
    socket.close(code || 1005);
  });
};

export default wsEntryPointHandler;
