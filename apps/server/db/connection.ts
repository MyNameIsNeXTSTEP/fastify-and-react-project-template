import { Sequelize, importModels } from '@sequelize/core';
import { PostgresDialect } from '@sequelize/postgres';
import { config } from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const currentDirname = dirname(fileURLToPath(import.meta.url));
config({ path: path.join(currentDirname, '.env') });

const dbConfig = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'guss_game_db',
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres',
  logging: process.env.NODE_ENV === 'development' ? (sql: string, timing?: number) => console.info(sql) : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const models = await importModels(currentDirname + '/**/*.model.{ts,js}');

export const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  user: dbConfig.username,
  password: dbConfig.password,
  logging: dbConfig.logging as false | ((sql: string, timing?: number) => void),
  pool: dbConfig.pool,
  schema: 'public',
  models,
  define: {
    timestamps: true,
    underscored: true,
    freezeTableName: true,
  },
});

async function syncDatabase() {
  try {
    if (!sequelize.models) {
      throw new Error('No models were found.\nMake sure model files follow the *.model.{ts,js} naming pattern.');
    }
    await sequelize.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

export const connectDB = async (): Promise<void> => {
  try {
    await Promise.all([
      syncDatabase(),
      sequelize.authenticate()
    ]);
    console.log('Database: Connection has been established successfully.');
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log('Database: Models synchronized.');
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Database: Unable to connect to the database:', errorMessage);
    throw new Error(`Database connection failed: ${errorMessage}`);
  }
};

export const closeDB = async (): Promise<void> => {
  try {
    await sequelize.close();
    console.log('Database: Connection closed.');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Database: Error closing connection:', errorMessage);
    throw new Error(`Database close failed: ${errorMessage}`);
  }
};

export default sequelize;