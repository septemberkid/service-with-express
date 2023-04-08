import { config as dotEnv } from 'dotenv';

interface IConfiguration {
  readonly NODE_ENV: 'production'|'development';
  readonly APP_PORT: number;
  readonly APP_STATIC_PATH: string;
  readonly APP_ROOT_PATH: string;
  readonly APP_KEY: string;
  readonly APP_HKEY_EXPIRED: number;
  readonly JWT_SECRET: string;
  readonly JWT_ISSUER: string;
  readonly JWT_EXPIRED: number;
  readonly LOG_DIR: string;
  readonly DB_HOST: string;
  readonly DB_PORT: number;
  readonly DB_NAME: string;
  readonly DB_USERNAME: string;
  readonly DB_PASSWORD: string;
  readonly DB_MIN_POOL: number;
  readonly DB_MAX_POOL: number;
  readonly DB_IDLE_TIMEOUT: number;
  readonly DB_CONNECTION_TIMEOUT: number;
  readonly MINIO_ENDPOINT: string;
  readonly MINIO_PORT: number;
  readonly MINIO_USE_SSL: boolean;
  readonly MINIO_ACCESS_KEY: string;
  readonly MINIO_SECRET_KEY: string;
  readonly MINIO_BUCKET_NAME: string;
  readonly MINIO_EXPIRED: number;
}
export class Config {
  private readonly _configurations: IConfiguration;
  constructor(configurations: IConfiguration) {
    this._configurations = configurations;
  }
  get<K extends keyof IConfiguration>(key: K): IConfiguration[K] {
    if (typeof this._configurations[key] === 'undefined')
      throw new Error(`Config with ${key} not found.`)
    return this._configurations[key];
  }
  getOrDefault<T extends number|string|boolean, K extends keyof IConfiguration>(key: K, defaultValue: T):
    T extends boolean ? boolean :
      T extends string ? string :
        number {
    if (!this._configurations[key])
      return defaultValue as any;
    return this._configurations[key] as any;
  }
}
export class Configuration {
  private static _config: Config = null;
  static instance() {
    if (this._config == null) {
      const env = dotEnv({
        path: `.env.${process.env.NODE_ENV || 'development'}`,
      }).parsed;
      this._config = new Config({
        NODE_ENV: env.NODE_ENV == 'development' ? 'development' : 'production',
        APP_PORT: Number(env.APP_PORT),
        APP_ROOT_PATH: env.APP_ROOT_PATH,
        APP_STATIC_PATH: env.APP_STATIC_PATH,
        APP_HKEY_EXPIRED: Number(env.APP_HKEY_EXPIRED),
        APP_KEY: env.APP_KEY,
        DB_CONNECTION_TIMEOUT: Number(env.DB_CONNECTION_TIMEOUT || 60000),
        DB_HOST: env.DB_HOST,
        DB_IDLE_TIMEOUT: Number(env.DB_IDLE_TIMEOUT || 1800000),
        DB_MAX_POOL: Number(env.DB_MAX_POOL || 10),
        DB_MIN_POOL: Number(env.DB_MIN_POOL || 5),
        DB_NAME: env.DB_NAME,
        DB_PASSWORD: env.DB_PASSWORD,
        DB_PORT: Number(env.DB_PORT || 5432),
        DB_USERNAME: env.DB_USERNAME,
        JWT_EXPIRED: Number(env.JWT_EXPIRED || 3600),
        JWT_ISSUER: env.JWT_ISSUER,
        JWT_SECRET: env.JWT_SECRET,
        LOG_DIR: env.LOG_DIR,
        MINIO_ACCESS_KEY: env.MINIO_ACCESS_KEY,
        MINIO_BUCKET_NAME: env.MINIO_BUCKET_NAME || 'bucket',
        MINIO_ENDPOINT: env.MINIO_ENDPOINT,
        MINIO_EXPIRED: Number(env.MINIO_EXPIRED || 7200),
        MINIO_PORT: Number(env.MINIO_PORT || 9090),
        MINIO_SECRET_KEY: env.MINIO_SECRET_KEY,
        MINIO_USE_SSL: env.MINIO_USE_SSL == 'true'
      });
    }
    return this._config;
  }
}