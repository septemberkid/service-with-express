import { LocaleObject } from "i18n";


export namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string;

    APP_PORT: number;
    APP_ROOT_PATH: string;
    APP_STATIC_PATH: string;
    APP_KEY: string;
    APP_HKEY_EXPIRED: number;
    JWT_EXPIRED: number;
    LOG_DIR: string;
    DB_HOST: string;
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_MIN_POOL: number;
    DB_MAX_POOL: number;
    DB_IDLE_TIMEOUT: number;
    DB_CONNECTION_TIMEOUT: number;
  }
}

declare global {
  namespace Express {
    interface Response {
      __(key: string, options?: LocaleObject): string;
      __n(key: string, count: number, options?: LocaleObject): string;
    }
    interface Request {
      locale: string;
    }
  }
}