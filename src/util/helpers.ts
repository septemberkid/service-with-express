import { v5 as uuidV5 } from 'uuid';
import { Request } from 'express';

const UUID_NAMESPACE = 'dae73761-9a06-4455-bff9-99c5dc9aa03d';
export const toUppercase = (value: string): string => value?.toUpperCase();

export const mapEnumToTypes = <T>(typeEnum: T): { [key in keyof T]: symbol } => {
  const typeObject: { [key: string]: symbol } = {};
  Object.keys(typeEnum).forEach((key: string): void => {
    typeObject[key] = Symbol.for(typeEnum[key]);
  });
  return typeObject as { [key in keyof T]: symbol };
};

export const mapEnumToConst = <T>(typeEnum: T): { [key in keyof T]: string } => {
  const typeObject: { [key: string]: string } = {};
  Object.keys(typeEnum).forEach((key: string): void => {
    typeObject[key] = typeEnum[key];
  });
  return typeObject as { [key in keyof T]: string };
};
export const generateUUID = (value: string) : string => {
  return uuidV5(value, UUID_NAMESPACE);
}

export const getHeader = (req: Request, key: string) => {
  return (req.headers[key] || null) as string
}

export const getClientName = (req: Request) => getHeader(req, 'x-client-name');

export const isEmpty = (value: string|any[]|number|undefined) : boolean => {
  return (typeof value === 'undefined') || (typeof value == 'string' && value.trim() == '') ||
    (typeof value == 'object' && value.length == 0)
}
export const ltrim = (str: string, char: string) => {
  const regexTrim = (!char) ? new RegExp('^\\s+') : new RegExp('^'+char+'+');
  return str.replace(regexTrim, '');
}
export const rtrim = (str: string, char: string) => {
  const regexTrim = (!char) ? new RegExp('\\s+$') : new RegExp(char+'+$');
  if (!regexTrim.test(str))
    return str.replace('\\', '');
  return str.replace(regexTrim, '');
}

export const numToBoolean = (value: any, defaultValue: boolean) => {
  if (typeof value == 'undefined')
    return defaultValue;
  const result = parseInt(value);
  return result == 1;
};