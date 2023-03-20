enum TYPES_ENUM {
  DATABASE_CONNECTION = 'DATABASE_CONNECTION',
  ENTITY_MANAGER = 'ENTITY_MANAGER',
  LOGGER = 'LOGGER',
}

type InversifyBinding = { [key in keyof typeof TYPES_ENUM]: symbol };
type IndexObject = { [key: string]: symbol };

const mapEnumToTypes = <T>(typeEnum: T): InversifyBinding => {
  const typeObject: IndexObject = {};
  Object.keys(typeEnum).forEach((key: string): void => {
    typeObject[key] = Symbol.for(typeEnum[key]);
  });
  return typeObject as InversifyBinding;
};
const TYPES = mapEnumToTypes(TYPES_ENUM);
export default TYPES;
