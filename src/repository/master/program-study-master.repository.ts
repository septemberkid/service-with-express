import CrudInterface from '@interface/crud.interface';
import PageMetaInterface from '@interface/page-meta.interface';
import { inject, injectable } from 'inversify';
import { EntityManager } from '@mikro-orm/core';
import TYPES from '@enums/types.enum';
import { paginationQuery } from '@util/query';
import ProgramStudyMasterEntity from '@entity/master/program-study-master.entity';
import ProgramStudyMasterDto from '@dto/master/program-study-master.dto';
import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';

@injectable()
export default class ProgramStudyMasterRepository implements CrudInterface<ProgramStudyMasterEntity, ProgramStudyMasterDto> {
  @inject<EntityManager>(TYPES.ENTITY_MANAGER)
  private _em: EntityManager;

  create(_: ProgramStudyMasterDto): Promise<ProgramStudyMasterEntity> {
    return Promise.resolve(undefined);
  }

  delete(_: Record<string, unknown>): Promise<boolean> {
    return Promise.resolve(false);
  }

  async retrieve<T>(pk: T): Promise<ProgramStudyMasterEntity> {
    return await this._em.findOne(ProgramStudyMasterEntity, {
      xid: pk
    });
  }

  update(_: Record<string, unknown>, __: ProgramStudyMasterDto): Promise<ProgramStudyMasterEntity> {
    return Promise.resolve(undefined);
  }

  async pagination(where: Record<string, unknown>, query: BasePaginatedRequestDto): Promise<{ readonly result: ProgramStudyMasterEntity[]; readonly meta: PageMetaInterface }> {
    const {records, total, page, pages} = await paginationQuery<ProgramStudyMasterEntity>(this._em, ProgramStudyMasterEntity, where, query);
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