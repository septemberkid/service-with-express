import { mapEnumToTypes } from '@util/helpers';

export enum VALIDATION_ENUM {
  SPECIFIC_EMAIL_DOMAIN = 'SPECIFIC_EMAIL_DOMAIN',
  INVALID_EXTENSION = 'INVALID_EXTENSION'
}
const VALIDATION = mapEnumToTypes(VALIDATION_ENUM);
export default VALIDATION;