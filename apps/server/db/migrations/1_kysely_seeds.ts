import type { Kysely } from 'kysely';
import type { DB } from '../db.js';

export async function up(db: Kysely<DB>): Promise<void> {
  await db.schema.createTable('kysely_seeds')
    .addColumn('name', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('timestamp', 'timestamp', (col) => col.notNull().defaultTo('now()'))
    .execute();
};

export async function down(db: Kysely<DB>): Promise<void> {
  await db.schema.dropTable('kysely_seeds').execute();
};
