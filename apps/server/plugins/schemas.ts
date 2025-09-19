// 'use strict';
// /**
//  * Recursively add API schemas
//  */
// import type { FastifyInstance } from 'fastify';
// import { pathToFileURL } from 'url';
// import { promises as fs } from 'fs';
// import path from 'path';

// const dirPath = path.resolve(__dirname, 'shared/api/v1/schemas/ws');

// async function loadSchemasFromDir(fastify: FastifyInstance, dirName: string) {
//   const items = await fs.readdir(dirName, { withFileTypes: true });
//   for (const item of items) {
//     const fullPath = path.join(dirName, item.name);
//     if (item.isFile() && item.name.endsWith('.schema.js')) {
//       const schema = (await import(pathToFileURL(fullPath).href)).default;
//       fastify.addSchema(schema);
//     } else if (item.isDirectory()) {
//       await loadSchemasFromDir(fastify, fullPath);
//     }
//   }
// }

// async function schemaLoaderPlugin(fastify: FastifyInstance) {
//   console.log(`Loading schemas from ${dirPath}...`);
//   await loadSchemasFromDir(fastify, dirPath);
//   console.log(`Loaded schemas successefully`);
// }

// export default schemaLoaderPlugin;
