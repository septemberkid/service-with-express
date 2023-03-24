export const toUppercase = (value: string): string => value.toUpperCase();

export const mapEnumToTypes = <T>(typeEnum: T): { [key in keyof T]: symbol } => {
  const typeObject: { [key: string]: symbol } = {};
  Object.keys(typeEnum).forEach((key: string): void => {
    typeObject[key] = Symbol.for(typeEnum[key]);
  });
  return typeObject as { [key in keyof T]: symbol };
};

export const getExtension = (filename: string): string => {
  const parts = filename.split('.');
  return parts[parts.length - 1];
}