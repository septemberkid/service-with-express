import { config } from 'dotenv';
import process from 'process';
import { Options } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { ClientOptions } from 'minio';
config({
  path: `.env.${process.env.NODE_ENV || 'development'}`,
});

export const {
  NODE_ENV,
  APP_PORT,
  APP_ROOT_PATH,
  APP_STATIC_PATH,
  APP_HKEY_EXPIRED,
  JWT_EXPIRED,
  LOG_DIR,
  DB_NAME,
  DB_HOST,
  DB_PORT,
  DB_USERNAME,
  DB_PASSWORD,
  DB_CONNECTION_TIMEOUT,
  DB_IDLE_TIMEOUT,
  DB_MAX_POOL,
  DB_MIN_POOL,
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_USE_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY
} = process.env;

export const dbConfig: Options<PostgreSqlDriver> = {
  driver: PostgreSqlDriver,
  dbName: DB_NAME,
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  user: DB_USERNAME,
  password: DB_PASSWORD,
  debug: NODE_ENV === 'development',
  allowGlobalContext: true,
  pool: {
    min: Number(DB_MIN_POOL) || 5,
    max: Number(DB_MAX_POOL) || 10,
    idleTimeoutMillis: Number(DB_IDLE_TIMEOUT) || 1800000,
    acquireTimeoutMillis: Number(DB_CONNECTION_TIMEOUT) || 60000,
  },
  entities: [path.dirname(__dirname) + '/entity'],
  migrations: {
    path: path.dirname(path.dirname(__dirname)) + '/migrations',
    tableName: 'sys_migration',
    transactional: true,
  },
};
export const minioConfig: ClientOptions = {
  endPoint: MINIO_ENDPOINT,
  port: Number(MINIO_PORT) || 9090,
  useSSL: MINIO_USE_SSL == 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY
}