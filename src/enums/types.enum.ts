import { mapEnumToTypes } from '@util/helpers';

enum TYPES_ENUM {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  ENTITY_MANAGER = 'ENTITY_MANAGER',
  LOGGER = 'LOGGER',
  MINIO_INSTANCE = 'MINIO_INSTANCE',
}
const TYPES = mapEnumToTypes(TYPES_ENUM);
export default TYPES;
