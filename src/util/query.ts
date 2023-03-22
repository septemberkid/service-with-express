import { isArray, isEmpty } from 'class-validator';
import { EntityManager, EntityName } from '@mikro-orm/core';

export const calculatedPagination = (total: number, limit: number, offset: number): { page: number, pages: number } => {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  return {
    page,
    pages
  };
};

interface IWhere {
  ilike?: {
    [fieldName: string]: (wrapper: (value: string, mark: 'both' | 'before' | 'after') => string) => string
  },
  in?: { [fieldName: string]: any[] }
}

export const populateWhere = (wheres: IWhere) => {
  /**
   * {
   *   fieldName: {
   *     $ilike: value
   *   }
   * }
   */
  const fields = {};


  if (wheres.ilike != undefined) {
    Object.keys(wheres.ilike).forEach(fieldName => {
      const callback = wheres.ilike[fieldName];
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

  if (wheres.in != undefined) {
    Object.keys(wheres.in).forEach(fieldName => {
      const value = wheres.in[fieldName];
      if (isArray(value)) {
        fields[fieldName] = {
          ...fields[fieldName],
          $in: wheres.in[fieldName]
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
  order: string,
  limit: number,
  offset: number
) : Promise<{
  readonly records: E[],
  readonly total: number,
  readonly page: number,
  readonly pages: number
}> => {
  const options = { limit, offset }
  const {orderBy, sort} = getOrder(order);
  if (!isEmpty(orderBy)) {
    options['orderBy'] = {
      [orderBy]: sort
    }
  }
  console.log(options)
  const total = await em.count(entity, where);
  const {page, pages} = calculatedPagination(total, limit, offset);
  let records: E[] = [];
  // if offset greater than total, don't execute this query!
  if (offset < total) {
    records = await em.find(entity, where, options) as E[];
  }
  
  return {
    records,
    total,
    page,
    pages
  }
}