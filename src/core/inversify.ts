import { AsyncContainerModule } from 'inversify';
import DatabaseClient from '@core/database-client';
import TYPES from '@enums/types.enum';
import glob from 'glob';
import path from 'path';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import Logger from '@util/logger';
import winston from 'winston';

export const inversifyBindings = new AsyncContainerModule(
  async (bind): Promise<void> => {
    const databaseClient: DatabaseClient = new DatabaseClient();
    const connection = await databaseClient.connect();
    if (connection) {
      // Run Migrations
      // await connection.getMigrator().up();
      // Connection Bindings
      bind<MikroORM<PostgreSqlDriver>>(
        TYPES.DATABASE_CONNECTION
      ).toConstantValue(connection);

      const em = connection.em;
      bind<SqlEntityManager<PostgreSqlDriver>>(
        TYPES.ENTITY_MANAGER
      ).toConstantValue(em);
    }

    // load controllers
    const controllers = await new Promise((resolve, _) => {
      glob(
        path.join(
          path.dirname(__dirname),
          '/controller/**/*.controller.{ts,js}'
        ),
        (_, files) => {
          resolve(files);
        }
      );
    }).then(async (files: string[]) => {
      const controllers = await Promise.all(
        files.map((f) => import(f.replace(__dirname, '.')))
      );
      return controllers.map((c) => c.default);
    });
    controllers.forEach((c) => bind(c).to(c));
    // load repositories
    const repositories = await new Promise((resolve, _) => {
      glob(
        path.join(
          path.dirname(__dirname),
          '/repository/**/*.repository.{ts,js}'
        ),
        (_, files) => {
          resolve(files);
        }
      );
    }).then(async (files: string[]) => {
      const repositories = await Promise.all(
        files.map((f) => import(f.replace(__dirname, '.')))
      );
      return repositories.map((c) => c.default);
    });
    repositories.forEach((c) => bind(c.name).to(c));
    // binding logger
    bind<winston.Logger>(TYPES.LOGGER).toConstantValue(Logger);
  }
);
