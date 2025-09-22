'use strict';

import 'dotenv/config';
import type { ComparisonOperatorExpression, RawBuilder, ReferenceExpression, SelectQueryBuilder } from 'kysely';
import { CamelCasePlugin, Kysely, PostgresDialect, sql } from 'kysely';
import { Pool } from 'pg';
import type { DB } from './db.d.js';

class KyselyPGConnection {
  constructor() {}

  init() {
    const dialect = new PostgresDialect({
      pool: new Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        database: process.env.POSTGRES_DB || 'project_template_db',
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
      }),
    });
    const logSqlQueries = process.env.LOG_SQL_QUERIES === 'true';

    return new Kysely<DB>({
      dialect,
      plugins: [new CamelCasePlugin()],
      log: event => {
        if (!logSqlQueries) {
          return;
        }
        if (event.level !== 'query') {
          return;
        }
        console.debug(
          `SQL:\n${this.hydrateSQLParameters(event.query.sql, event.query.parameters)}\nDuration: ${event.queryDurationMillis} ms`
        );
      },
    });
  }

  private hydrateSQLParameters(sql: string, parameters: readonly unknown[]): string {
    return sql.replace(/(\$\d+)/g, value => {
      const index = Number(value.slice(1)) - 1;
      const parameter = parameters[index];
      if (typeof parameter === 'string') {
        return `'${parameter}'`;
      }
      if (typeof parameter === 'object' && parameter instanceof Date) {
        return `'${parameter.toISOString()}'`;
      }
      return String(parameter);
    });
  }
}

const db = new KyselyPGConnection().init();

export type TKyselyDb = typeof db;

export function toJson<T>(value: T): RawBuilder<T> {
  return sql`CAST(${JSON.stringify(value)} AS JSONB)`;
}

export function addWhereIfExist<T extends keyof DB, S>(
  query: SelectQueryBuilder<DB, T, S>,
  columnName: ReferenceExpression<DB, T>,
  whereCondition: string,
  comparator = '=' as ComparisonOperatorExpression
) {
  return query.where(columnName, comparator, whereCondition);
}

export default db;
