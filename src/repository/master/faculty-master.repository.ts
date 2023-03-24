import CrudInterface from '@interface/crud.interface';
import PageMetaInterface from '@interface/page-meta.interface';
import FacultyMasterEntity from '@entity/master/faculty-master.entity';
import { inject, injectable } from 'inversify';
import { EntityManager } from '@mikro-orm/core';
import TYPES from '@enums/types.enum';
import { paginationQuery } from '@util/query';
import FacultyMasterDto from '@dto/master/faculty-master.dto';
import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';

@injectable()
export default class FacultyMasterRepository implements CrudInterface<FacultyMasterEntity, FacultyMasterDto> {
  @inject<EntityManager>(TYPES.ENTITY_MANAGER)
  private _em: EntityManager;

  create(_: FacultyMasterDto): Promise<FacultyMasterEntity> {
    return Promise.resolve(undefined);
  }

  delete(_: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(false);
  }

  async retrieve<T>(pk: T): Promise<FacultyMasterEntity> {
    return await this._em.findOne(FacultyMasterEntity, {
      xid: pk
    })
  }

  update(_: Record<string, unknown>, __: FacultyMasterDto): Promise<FacultyMasterEntity> {
    return Promise.resolve(undefined);
  }

  async pagination(where: Record<string, unknown>, query: BasePaginatedRequestDto): Promise<{ readonly result: FacultyMasterEntity[]; readonly meta: PageMetaInterface }> {
    const {records, total, page, pages} = await paginationQuery<FacultyMasterEntity>(this._em, FacultyMasterEntity, where, query);
    return  {
      result: records,
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
        page,
        pages,
      }
    }
  }


}