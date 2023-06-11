import { EntityRepository } from '@mikro-orm/postgresql';
import PageMetaInterface from '@interface/page-meta.interface';
import {buildWhereQuery, calculatedPagination, convertOrder} from '@util/query';
import {FilterQuery} from '@mikro-orm/core';
import {QueryOrderMap} from '@mikro-orm/core/enums';
import HttpException from '@exception/http.exception';
import {RequestUserInterface} from '@interface/request-user.interface';
import {nowAsTimestamp} from '@util/date-time';
import {AutoPath} from '@mikro-orm/core/typings';

interface IPageOption {
  readonly limit?: number;
  readonly offset?: number;
}
export default abstract class BaseRepository<E extends object> extends EntityRepository<E> {
  public async page<P extends string>(
      entity: {
        new (...args: string[]): E
      },
      where: FilterQuery<E>,
      order: string,
      pageOption: IPageOption = {limit: 20, offset: 0},
      withTrash = false,
      populate: AutoPath<E, P>[] = []
  ): Promise<{
    readonly result: E[],
    readonly meta: PageMetaInterface,
  }> {
    where = buildWhereQuery<E>(new entity(), where, withTrash);
    const orderBy = convertOrder(order) as QueryOrderMap<E>;
    const total = await this.count(where)
    const {page, pages} = calculatedPagination(total, pageOption.limit, pageOption.offset)
    const records = await this.find(where, {
      limit: pageOption.limit,
      offset: pageOption.offset,
      orderBy: orderBy,
      populate
    })
    return {
      result: records,
      meta: {
        limit: pageOption.limit,
        offset: pageOption.offset,
        total,
        page,
        pages
      }
    }
  }

  public async softDelete(where: FilterQuery<E>, req: RequestUserInterface): Promise<E> {
    const result = await this.retrieve(where);
    await this.isEntitySupportedSoftDeletes(result);
    result['deleted_by'] = {
      id: req.user.id,
      name: req.user.name
    }
    result['deleted_at'] = nowAsTimestamp();
    await this.persistAndFlush(result)
    return result;
  }

  async retrieve(where: FilterQuery<E>) {
    const result = await this.findOne(where);
    if (!result)
      throw new HttpException(404, 'Data not found.')
    return result;
  }
  private async isEntitySupportedSoftDeletes(entity: E) {
    if (!entity.hasOwnProperty('deleted_at') || !entity.hasOwnProperty('deleted_by'))
      throw new HttpException(500, 'Your entity doesn\'t supported for soft deletes.')
  }
  public async restore(where: FilterQuery<E>): Promise<E> {
    const result = await this.retrieve(where);
    await this.isEntitySupportedSoftDeletes(result);
    result['deleted_by'] = null;
    result['deleted_at'] = null;
    await this.persistAndFlush(result)
    return result;
  }
}