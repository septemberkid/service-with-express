import { mapEnumToConst } from '@util/helpers';

export enum DOCUMENT_ENUM {
  FRS = 'FRS',
  TRANSCRIPT = 'TRANSCRIPT',
  RECOMMENDATION_LETTER = 'RECOMMENDATION_LETTER',
}
const DOCUMENT = mapEnumToConst(DOCUMENT_ENUM);
export default DOCUMENT;