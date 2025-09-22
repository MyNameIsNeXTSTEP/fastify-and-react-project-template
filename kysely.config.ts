import { defineConfig } from 'kysely-ctl';
import db from './apps/server/db/index.js';

export default defineConfig({
  destroyOnExit: true,
  kysely: db,
  migrations: {
    migrationFolder: './apps/server/db/migrations',
  },
  seeds: {
    seedFolder: './apps/server/db/seeds',
  },
});
