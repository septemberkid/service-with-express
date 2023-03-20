import { MikroORM } from '@mikro-orm/core';
import chalk from 'chalk';
import { dbConfig } from '@config';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

export default class DatabaseClient {
  public async connect(): Promise<MikroORM<PostgreSqlDriver>> {
    try {
      return await MikroORM.init(dbConfig);
    } catch (error) {
      process.stdout.write(chalk.redBright(`${(error as Error).message}\n`));
    }
  }
}
