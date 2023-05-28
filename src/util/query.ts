import { isArray, isEmpty } from 'class-validator';
import { EntityManager, EntityName } from '@mikro-orm/core';
import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';

export const calculatedPagination = (total: number, limit: number, offset: number): { page: number, pages: number } => {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  return {
    page,
    pages
  };
};

interface IWhere {
  eq?: { [fieldName: string]: string|number|boolean }
  ilike?: {
    [fieldName: string]: (wrapper: (value: string, mark: 'both' | 'before' | 'after') => string) => string
  },
  in?: { [fieldName: string]: string|number[] }
}

export const populateWhere = (where: IWhere) => {
  const fields = {};


  if (where.ilike != undefined) {
    Object.keys(where.ilike).forEach(fieldName => {
      const callback = where.ilike[fieldName];
      if (typeof callback === 'function') {
        const value = callback((v, mark) => {
          if (!isEmpty(v)) {
            if (mark == 'both') return `%${v}%`;
            else if (mark == 'before') return `%${v}`;
            else if (mark == 'after') return `${v}%`;
          }
          return null;
        });
        if (!isEmpty(value)) {
          fields[fieldName] = {
            ...fields[fieldName],
            $ilike: value
          }
        }
      }

    });
  }

  if (where.eq != undefined) {
    Object.keys(where.eq).forEach(fieldName => {
      const value = where.eq[fieldName];
      if (!isEmpty(value)) {
        fields[fieldName] = {
          ...fields[fieldName],
          $eq: value
        }
      }
    });
  }

  if (where.in != undefined) {
    Object.keys(where.in).forEach(fieldName => {
      const value = where.in[fieldName];
      if (isArray(value)) {
        fields[fieldName] = {
          ...fields[fieldName],
          $in: where.in[fieldName]
        };
      }
    });
  }
  return fields;
};

const getOrder = (order: string) : {
  orderBy: string,
  sort: string
} => {
  if (isEmpty(order))
    return {
      orderBy: null,
      sort: null
    };
  const parts = order.split('|');
  let orderBy = null;
  let sort = 'asc';
  if (parts[0] != undefined) orderBy = parts[0]
  if (parts[1] != undefined) sort = parts[1]
  return {
    orderBy,
    sort
  }
}
export const paginationQuery = async <E>(
  em: EntityManager,
  entity: EntityName<object>,
  where: Record<string, unknown>,
  query: BasePaginatedRequestDto
) : Promise<{
  readonly records: E[],
  readonly total: number,
  readonly page: number,
  readonly pages: number
}> => {
  const options = { limit: query.limit, offset: query.offset }
  const {orderBy, sort} = getOrder(query.order);
  if (!isEmpty(orderBy)) {
    options['orderBy'] = {
      [orderBy]: sort
    }
  }
  const total = await em.count(entity, where);
  const {page, pages} = calculatedPagination(total, options.limit, options.offset);
  let records: E[] = [];
  // if offset greater than total, don't execute this query!
  if (options.offset < total) {
    records = await em.find(entity, where, options) as E[];
  }
  
  return {
    records,
    total,
    page,
    pages
  }
}