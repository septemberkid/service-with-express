import { mapEnumToConst } from '@util/helpers';

export enum PERIOD_STATUS_ENUM {
  OPEN = 'OPEN',
  REVIEW = 'REVIEW',
  FINAL = 'FINAL',
}

const PERIOD_STATUS = mapEnumToConst(PERIOD_STATUS_ENUM);
export default PERIOD_STATUS;