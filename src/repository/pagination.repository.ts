import { EntityRepository } from '@mikro-orm/postgresql';
import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';
import PageMetaInterface from '@interface/page-meta.interface';
import { paginationQuery } from '@util/query';

export default abstract class PaginationRepository<E extends object> extends EntityRepository<E> {
  public async pagination(
    entity: { new (...args: string[]) : E },
    where: Record<string, unknown>,
    query: BasePaginatedRequestDto
  ): Promise<{ readonly result: E[]; readonly meta: PageMetaInterface }> {
    const { records, total, page, pages } = await paginationQuery<E>(this._em, entity, where, query);
    return {
      result: records,
      meta: {
        limit: query.limit,
        offset: query.offset,
        total,
        page,
        pages
      }
    };
  }
}