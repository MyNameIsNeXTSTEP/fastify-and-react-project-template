// import { type TSessionActions } from '@domain/session';
import type { WebSocket } from 'ws';

declare module 'fastify' {
  export interface FastifyRequest {
    jwtVerify(): Promise<any>;
    user?: any;
  }

  export interface FastifyInstance<
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpServer = Server,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpRequest = IncomingMessage,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    HttpResponse = ServerResponse
  > {
    // session: TSessionActions;
    jwt: {
      verify: (token: string) => any;
      sign: (payload: any, options?: any) => string;
    };
    httpAuth: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<undefined>;
    wsAuth: (
      socket: WebSocket,
      token: string,
      request: FastifyRequest
    ) => undefined;
  }
}
