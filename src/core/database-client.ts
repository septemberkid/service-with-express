import { MikroORM, Options } from '@mikro-orm/core';
import chalk from 'chalk';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import path from 'path';
import { Configuration } from '@core/config';

export default class DatabaseClient {
  private readonly dbConfig: Options<PostgreSqlDriver>
  constructor() {
    const config = Configuration.instance();
    this.dbConfig = {
      driver: PostgreSqlDriver,
      dbName: config.get('DB_NAME'),
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      user: config.get('DB_USERNAME'),
      password: config.get('DB_PASSWORD'),
      debug: config.get('NODE_ENV') === 'development',
      allowGlobalContext: true,
      pool: {
        min: config.get('DB_MIN_POOL'),
        max: config.get('DB_MAX_POOL'),
        idleTimeoutMillis: config.get('DB_IDLE_TIMEOUT'),
        acquireTimeoutMillis: config.get('DB_CONNECTION_TIMEOUT'),
      },
      entities: [
        path.join(path.dirname(__dirname), 'entity')
      ]
    }
  }
  public async connect(): Promise<MikroORM<PostgreSqlDriver>> {
    try {
      return await MikroORM.init(this.dbConfig);
    } catch (error) {
      process.stdout.write(chalk.redBright(`${(error as Error).message}\n`));
    }
  }
}
