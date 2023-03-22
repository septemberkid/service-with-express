import CrudInterface from '@interface/crud.interface';
import PageMetaInterface from '@interface/page-meta.interface';
import FacultyMasterEntity from '@entity/master/faculty-master.entity';
import { inject, injectable } from 'inversify';
import { EntityManager } from '@mikro-orm/core';
import TYPES from '@enums/types.enum';
import { paginationQuery } from '@util/query';
import FacultyMasterDto from '@dto/master/faculty-master.dto';

@injectable()
export default class FacultyMasterRepository implements CrudInterface<FacultyMasterEntity, FacultyMasterDto> {
  @inject<EntityManager>(TYPES.ENTITY_MANAGER)
  private _em: EntityManager;

  create(dto: FacultyMasterDto): Promise<FacultyMasterEntity> {
    return Promise.resolve(undefined);
  }

  delete(where: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(false);
  }

  async retrieve<T>(pk: T): Promise<FacultyMasterEntity> {
    return await this._em.findOne(FacultyMasterEntity, {
      xid: pk
    });
  }

  update(where: Record<string, unknown>, dto: FacultyMasterDto): Promise<FacultyMasterEntity> {
    return Promise.resolve(undefined);
  }

  async pagination(where: Record<string, unknown>, order: string, limit: number, offset: number): Promise<{ readonly result: FacultyMasterEntity[]; readonly meta: PageMetaInterface }> {
    const {records, total, page, pages} = await paginationQuery<FacultyMasterEntity>(this._em, FacultyMasterEntity, where, order, limit, offset);
    return  {
      result: records,
      meta: {
        limit,
        offset,
        total,
        page,
        pages,
      }
    }
  }


}