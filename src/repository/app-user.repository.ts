import { AppUserEntity } from '@entity/app/user.entity';
import TYPES from '@enums/types.enum';
import { inject, injectable } from 'inversify';
import { PostgreSqlDriver, SqlEntityManager } from '@mikro-orm/postgresql';

@injectable()
export default class AppUserRepository {
  @inject(TYPES.ENTITY_MANAGER)
  private readonly _em: SqlEntityManager<PostgreSqlDriver>;

  public async getCurrentUser() {
    return this._em.findOne<AppUserEntity>(AppUserEntity, {
      id: 1,
    });
  }
}
