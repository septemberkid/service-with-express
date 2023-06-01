import { mapEnumToConst } from '@util/helpers';

export enum ROLE_ENUM {
  STUDENT = 'STUDENT',
  KAPRODI = 'KAPRODI',
  SEKPRODI = 'SEKPRODI',
}

const ROLE = mapEnumToConst(ROLE_ENUM);
export default ROLE;