'use strict';

import type { FastifyPluginAsync } from 'fastify';

import wsV1EntryPointRoute from '@shared/api/v1/schemas/ws/ws.schema.js';
import wsEntryPointHandler from './handler.js';

const wsEntryRoute: FastifyPluginAsync = async (fastify) => {
  fastify.route({
    ...wsV1EntryPointRoute,
    handler: () => { },
    // @ts-ignore
    wsHandler: wsEntryPointHandler(fastify),
  });
};

export default wsEntryRoute;
