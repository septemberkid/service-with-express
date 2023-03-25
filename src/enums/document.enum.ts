import { mapEnumToConst } from '@util/helpers';

export enum DOCUMENT_ENUM {
  FRS = 'FRS',
  PAYMENT_HISTORY = 'PAYMENT_HISTORY',
  TRANSCRIPT = 'TRANSCRIPT',
}
const DOCUMENT = mapEnumToConst(DOCUMENT_ENUM);
export default DOCUMENT;