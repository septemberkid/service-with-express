import { mapEnumToConst } from '@util/helpers';

export enum VALIDATION_ENUM {
  SPECIFIC_EMAIL_DOMAIN = 'SPECIFIC_EMAIL_DOMAIN',
  INVALID_EXTENSION = 'INVALID_EXTENSION'
}
const VALIDATION = mapEnumToConst(VALIDATION_ENUM);
export default VALIDATION;