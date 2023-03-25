import { mapEnumToConst } from '@util/helpers';

export enum SUBMISSION_STATUS_ENUM {
  NEW = 'NEW',
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}
const SUBMISSION_STATUS = mapEnumToConst(SUBMISSION_STATUS_ENUM);
export default SUBMISSION_STATUS;