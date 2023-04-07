import express, { Application, Router } from 'express';
import { InversifyExpressServer } from 'inversify-express-utils';
import { buildProviderModule } from 'inversify-binding-decorators';
import { Container } from 'inversify';
import { bindings } from '@core/inversify';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import bodyParser from 'body-parser';
import { APP_PORT, APP_ROOT_PATH, APP_STATIC_PATH, NODE_ENV } from '@config';
import chalk from 'chalk';
import useErrorMiddleware from '@middleware/error.middleware';
import useClientMiddleware from '@middleware/client.middleware';
import useI18nMiddleware from '@middleware/i18n.middleware';
import { MikroORM, RequestContext } from '@mikro-orm/core';
import TYPES from '@enums/types.enum';

export default class Server {
  private app: Application;

  private server: InversifyExpressServer;

  constructor() {
    this.initContainer()
      .then((container: Container) => {
        this.server = new InversifyExpressServer(
          container,
          Router({
            caseSensitive: true,
            mergeParams: true,
            strict: true,
          }),
          {
            rootPath: APP_ROOT_PATH as string,
          }
        );
        this.server.setConfig((app: Application) => {
          // Use Helmet To Add Different Security Headers To The Application
          app.use(helmet());
          // Use Cross Origin Resource Sharing
          app.use(cors());
          // Use Content-Encoding
          app.use(compression({
            level: 9,
            filter: (req, res) => {
              if (req.headers['x-no-compression']) {
                // don't compress responses with this request header
                return false;
              }
              return compression.filter(req, res);
            }
          }));
          // Use 'bodyParser' To Parse JSON And URL Params
          app.use(bodyParser.json());
          app.use(bodyParser.urlencoded({ extended: false }));
          // Use Static
          app.use(express.static(APP_STATIC_PATH as string));
          // Logger Middleware
          NODE_ENV === 'development' && app.use(morgan('dev'));
          
          // create different instances for each request
          app.use((req, res, _next) : void => {
            const connection = container.get<MikroORM>(TYPES.DATABASE_CONNECTION);
            RequestContext.create(connection.em, _next);
          })
          
          app.use(useI18nMiddleware);
          app.use(useClientMiddleware);
        });
        this.server.setErrorConfig((app: Application) =>
          app.use(useErrorMiddleware)
        );
        this.app = this.server.build();
        this.app.listen(APP_PORT, (): void => {
          process.stdout.write(
            chalk.greenBright(`server started on port ${APP_PORT as string}!\n`)
          );
        });
      })
      .catch((error) => {
        process.stdout.write(chalk.redBright(`${error}\n`));
        if (NODE_ENV === 'development') {
          console.trace(error)
        }
      });
  }

  private async initContainer(): Promise<Container> {
    const container = new Container({
      defaultScope: 'Singleton',
    });
    await container.loadAsync(bindings);
    await container.load(buildProviderModule());
    return container;
  }
}
