import { mapEnumToConst } from '@util/helpers';

export enum ROLE_ENUM {
  STUDENT = 'STUDENT',
  KAPRODI = 'KAPRODI'
}

const ROLE = mapEnumToConst(ROLE_ENUM);
export default ROLE;