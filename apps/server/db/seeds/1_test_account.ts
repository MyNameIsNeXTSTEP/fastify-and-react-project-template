import type { Kysely } from 'kysely';
import { hashPassword } from '@shared/lib/crypto';
import type { DB } from '../db.js';

export async function seed(db: Kysely<DB>): Promise<void> {
  const seedIsAlreadyExecuted = await db
    .selectFrom('kyselySeeds')
    .select('name')
    .where('name', '=', 'test_account')
    .executeTakeFirst();

  if (seedIsAlreadyExecuted) {
    console.log('Skipping seed: test_account, already executed');
    return;
  }

  await db
    .insertInto('kyselySeeds')
    .values({ name: 'test_account' })
    .onConflict(oc => oc.column('name').doNothing())
    .execute();

  await db
    .insertInto('account')
    .values({
      email: 'test@bk.ru',
      password: hashPassword('test123'),
    })
    .execute();

  console.log(`Seed: "1_test_account" ran successfully`);
  return;
};
