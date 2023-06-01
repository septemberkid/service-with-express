import { mapEnumToConst } from '@util/helpers';

export enum DOCUMENT_ENUM {
  FRS = 'FRS',
  TRANSCRIPT = 'TRANSCRIPT',
}
const DOCUMENT = mapEnumToConst(DOCUMENT_ENUM);
export default DOCUMENT;