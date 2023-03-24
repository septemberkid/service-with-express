import { mapEnumToTypes } from '@util/helpers';

export enum DOCUMENT_ENUM {
  FRS = 'FRS',
  PAYMENT_HISTORY = 'PAYMENT_HISTORY',
  TRANSCRIPT = 'TRANSCRIPT',
}
const DOCUMENT = mapEnumToTypes(DOCUMENT_ENUM);
export default DOCUMENT;