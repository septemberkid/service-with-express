import {AsyncContainerModule, interfaces} from 'inversify';
import DatabaseClient from '@core/database-client';
import TYPES from '@enums/types.enum';
import glob from 'glob';
import path from 'path';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';
import { Client as MinioClient } from 'minio';
import chalk from 'chalk';
import { Configuration } from '@core/config';
import MstFacultyEntity from '@entity/master/mst-faculty.entity';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';
import FacultyRepository from '@repository/master/faculty.repository';
import StudyProgramRepository from '@repository/master/study-program.repository';
import SubmissionPeriodRepository from '@repository/trx/submission-period.repository';
import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';
import SubmissionRepository from '@repository/trx/submission.repository';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';
import ViewSpkResultRepository from '@repository/view/view-spk-result.repository';
import ViewSpkResultEntity from '@entity/view/view-spk-result.entity';
import ClosePeriodScheduler from '@scheduler/close-period.scheduler';
export const bindings = new AsyncContainerModule(async (bind): Promise<void> => {
  const databaseClient: DatabaseClient = new DatabaseClient();
  const connection = await databaseClient.connect();
  if (connection) {
    bind<MikroORM<PostgreSqlDriver>>(
      TYPES.DATABASE_CONNECTION
    ).toConstantValue(connection);
    const em = connection.em;
    bind<SqlEntityManager<PostgreSqlDriver>>(TYPES.ENTITY_MANAGER).toConstantValue(em);
  }
  await newBindRepositories(bind, connection)
  await bindControllers(bind);
  await initMinio(bind);
  await scheduler(bind);
});

const bindControllers = async (bind: interfaces.Bind) => {
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
  controllers.forEach((c) => bind(c).toSelf());
}
const initMinio = async (bind: interfaces.Bind) => {
  try {
    const config = Configuration.instance();
    const minio: MinioClient = new MinioClient({
      endPoint: config.get('MINIO_ENDPOINT'),
      port: config.get('MINIO_PORT'),
      useSSL: config.get('MINIO_USE_SSL'),
      accessKey: config.get('MINIO_ACCESS_KEY'),
      secretKey: config.get('MINIO_SECRET_KEY'),
    });
    bind<MinioClient>(TYPES.MINIO_INSTANCE).toConstantValue(minio)
  } catch (error) {
    process.stdout.write(chalk.redBright(`${(error as Error).message}\n`));
  }
}
const newBindRepositories = async (bind: interfaces.Bind, connection: MikroORM<PostgreSqlDriver>) => {
  bind<FacultyRepository>(TYPES.FACULTY_REPOSITORY).toDynamicValue(() => new FacultyRepository(connection.em, MstFacultyEntity));
  bind<StudyProgramRepository>(TYPES.STUDY_PROGRAM_REPOSITORY).toDynamicValue(() => new StudyProgramRepository(connection.em, MstStudyProgramEntity));
  bind<SubmissionPeriodRepository>(TYPES.SUBMISSION_PERIOD_REPOSITORY).toDynamicValue(() => new SubmissionPeriodRepository(connection.em, TrxSubmissionPeriodEntity));
  bind<SubmissionRepository>(TYPES.SUBMISSION_REPOSITORY).toDynamicValue(() => new SubmissionRepository(connection.em, TrxSubmissionEntity));
  bind<ViewSpkResultRepository>(TYPES.VIEW_SPK_RESULT_REPOSITORY).toDynamicValue(() => new ViewSpkResultRepository(connection.em, ViewSpkResultEntity));
}

const scheduler = async (bind: interfaces.Bind) => {
  bind<ClosePeriodScheduler>(TYPES.SCHEDULER).to(ClosePeriodScheduler).inSingletonScope();
}