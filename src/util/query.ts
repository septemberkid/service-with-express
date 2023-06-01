import {FilterQuery, QueryOrder} from '@mikro-orm/core';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';

export const calculatedPagination = (total: number, limit: number, offset: number): { page: number, pages: number } => {
  const page = Math.floor(offset / limit) + 1;
  const pages = Math.ceil(total / limit);
  return {
    page,
    pages
  };
};

export const buildWhereQuery = <E>(entity: E, filter: FilterQuery<E>, withTrash: boolean) => {
  Object.keys(filter).forEach((field) => {
    Object.keys(filter[field]).forEach((operator) => {
      let value = filter[field][operator];
      if (value != undefined) {
        if (operator === '$ilike') {
          value = `%${value}%`
        }
        filter[field][operator] = value;
      } else {
        delete filter[field]
      }
    })
  })
  if (entity.hasOwnProperty('deleted_at') && entity.hasOwnProperty('deleted_by')) {
    if (withTrash) {
      Object.assign(filter, {
        deleted_at: {
          '$ne': null
        }
      })
    } else {
      Object.assign(filter, {
        deleted_at: {
          '$eq': null
        }
      })
    }
  }
  return filter;
}

export const convertOrder = (order?: string): {[key: string]: string} => {
  if (typeof order == 'undefined' || order == null)
    return null;
  const parts = order.split('|')
  if (parts.length != 2)
    throw ValidationException.newError('order', VALIDATION.INVALID_ORDER_PARAM, 'Invalid query parameter of order.')
  const field = parts[0]
  const direction = parts[1]
  return {
    [field]: direction == 'asc' ? QueryOrder.ASC_NULLS_LAST : QueryOrder.DESC_NULLS_LAST
  }
}