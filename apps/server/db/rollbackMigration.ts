import { Migrator, FileMigrationProvider } from 'kysely';
import db from './index.js';
import { __dirname } from '../../../system.js';
import path, { resolve } from 'path';
import fs from 'fs/promises';

async function rollbackLastMigration() {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: resolve(__dirname, './apps/server/db/migrations'),
    }),
  });
  const { error, results } = await migrator.migrateDown();
  if (error || !results) {
    throw error;
  }
  console.log(results);
  for (const result of results) {
    if (result.status === 'Success') {
      console.log(`Migration ${result.migrationName} rolled back successfully`);
    } else {
      console.log(`Rolling back a migration ${result.migrationName} failed`);
    }
  }
  await db.destroy();
};

rollbackLastMigration();
