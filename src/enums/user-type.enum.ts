import { mapEnumToConst } from '@util/helpers';

export enum USER_TYPE_ENUM {
  STUDENT = 'STUDENT',
  LECTURE = 'LECTURE'
}
const USER_TYPE = mapEnumToConst(USER_TYPE_ENUM);
export default USER_TYPE;