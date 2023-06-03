import 'reflect-metadata';
import { createServerApp, createContainer } from '@core/app';
import { Configuration } from '@core/config';
import BaseScheduler from '@scheduler/base.scheduler';
import TYPES from '@enums/types.enum';

(async () => {
  const config = Configuration.instance();
  const container = await createContainer();
  createServerApp(container, config)

  // run our schedulers
  const schedulers = container.getAll<BaseScheduler>(TYPES.SCHEDULER);
  for (const scheduler of schedulers) {
    scheduler.runCronJob();
  }
})();
