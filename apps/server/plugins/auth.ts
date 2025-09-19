import fp from 'fastify-plugin';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { type WebSocket } from 'ws';

const authPlugin = fp(async function (fastify: FastifyInstance) {
  fastify.register(fastifyJwt, {
    secret: 'supersecret',
    sign: {
      expiresIn: '7d',
    },
  });
  fastify.decorate(
    'httpAuth',
    async function (request: FastifyRequest, reply: FastifyReply) {
      const decoded = await request.jwtVerify();
      request.user = decoded;
      if (!decoded) {
        reply.code(400).send({
          ok: false,
          error: {
            message:
              'No valid auth token was provided, need to authenticate correctly or signup and use valid accessToken',
          },
        });
      }
      return;
    }
  );
  fastify.decorate(
    'wsAuth',
    function (socket: WebSocket, token: string, request: FastifyRequest) {
      try {
        if (!token) {
          console.log('No token provided');
          socket.send(
            JSON.stringify({
              code: 400,
              error: {
                message: 'No auth token was provided',
              },
            })
          );
          return;
        }
        const decoded = fastify.jwt.verify(token);
        request.user = decoded;
        return;
      } catch (err) {
        console.error('JWT verification failed:', err);
        socket.send(
          JSON.stringify({
            code: 400,
            error: {
              message: 'Auth token is invalid',
            },
          })
        );
      }
    }
  );
  /**
   * Only works for HTTP
   * @link https://fastify.dev/docs/latest/Reference/Hooks/#prevalidation
   */
  fastify.addHook(
    'preValidation',
    (request: FastifyRequest, reply: FastifyReply, done) => {
      // await fastify.httpAuth(request, reply);
      done();
    }
  );
});

export default authPlugin;
