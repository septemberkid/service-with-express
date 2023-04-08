import { Container, ContainerModule } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';
import express, { Router } from 'express';
import chalk from 'chalk';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import TYPES from '@enums/types.enum';
import useI18nMiddleware from '@middleware/i18n.middleware';
import useClientMiddleware from '@middleware/client.middleware';
import useErrorMiddleware from '@middleware/error.middleware';
import { bindings } from '@core/inversify';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Config } from '@core/config';


export const createContainer = async (): Promise<Container> => {
  const container =  new Container({
    defaultScope: 'Singleton'
  })
  await container.loadAsync(bindings);
  await container.load(buildProviderModule());
  return container;
}
export const createServerApp = (container: Container, config: Config): express.Application => {
  const server = new InversifyExpressServer(
    container,
    Router({
      caseSensitive: true,
      mergeParams: true,
      strict: true
    }),
    {
      rootPath: config.get('APP_ROOT_PATH')
    }
  )
  server.setConfig((app) => {
    app.use(helmet())
    app.use(cors())
    app.use(compression({
      level: 9,
      filter: (req, res) => {
        if (req.headers['x-no-compression']) {
          return false;
        }
        return compression.filter(req, res)
      }
    }))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(express.static(config.get('APP_STATIC_PATH')))
    if (config.get('NODE_ENV') == 'development')
      app.use(morgan('dev'))
    app.use((req, res, _next) => {
      const connection = container.get<MikroORM>(TYPES.DATABASE_CONNECTION);
      RequestContext.create(connection.em, _next);
    })
    app.use(useI18nMiddleware);
    app.use(useClientMiddleware);
  })
  server.setErrorConfig((app) => {
    app.use(useErrorMiddleware)
  })
  const app = server.build()
  const port = config.get('APP_PORT');
  app.listen(port, () => {
    process.stdout.write(
      chalk.greenBright(`server started on port ${port} as string!\n`)
    );
  })
  return app;
}
export const createTestingModule = (...modules: ContainerModule[]) => {
  const container = new Container({
    defaultScope: 'Singleton'
  })
  container.load(...modules.map((m) => m))
  return container;
}