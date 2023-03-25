import { mapEnumToConst } from '@util/helpers';

export enum USER_STATUS_ENUM {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}
const USER_STATUS = mapEnumToConst(USER_STATUS_ENUM);
export default USER_STATUS;