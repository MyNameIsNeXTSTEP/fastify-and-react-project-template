// import { type TSessionActions } from '@domain/session';
import type { WebSocket } from 'ws';

export interface WSRegistryEntry {
  handler: TWSHandler;
  schema: wsApi.WSMessageSchema;
}

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
    validateWSMessage: (
      message: wsApi.WSMessage | wsApi.WSParams,
      schema: object
    ) => { valid: boolean; data?: wsApi.WSMessage; errors?: null | ErrorObject[] };
    validateWSResponse: (
      response: wsApi.WSResponse,
      schema: object
    ) => { valid: boolean; data?: wsApi.WSResponse; errors?: null | ErrorObject[] };
    wsRegistry: {
      register: (method: string, handler: WSHandler, schema: wsApi.WSMessageSchema) => void;
      get: (method: string) => WSRegistryEntry | undefined;
      has: (method: string) => boolean;
      process: (message: wsApi.WSMessage, socket: WebSocket, request: FastifyRequest) => Promise<wsApi.WSResponse>;
    };
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
