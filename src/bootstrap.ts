import 'reflect-metadata';
import { createServerApp, createContainer } from '@core/app';
import { Configuration } from '@core/config';

(async () => {
  const config = Configuration.instance();
  const container = await createContainer();
  createServerApp(container, config)
})();
