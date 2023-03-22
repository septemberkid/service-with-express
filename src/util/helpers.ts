export const toUppercase = (value: string): string => value.toUpperCase();

export const removeAttributes = <T, K extends keyof T>(obj: T, ...removedAttributes: K[]) : Omit<T, K> => {
  const newObj = { ...obj };
  removedAttributes.forEach(attr => delete newObj[attr]);
  return newObj as Omit<T, K>;
};

export const pickAttributes = <T, K extends keyof T>(obj: T, ...pickAttributes: K[]) : Pick<T, K> => {
  const newObj = {} as Pick<T, K>;
  pickAttributes.forEach(attr => newObj[attr] = obj[attr]);
  return newObj as Pick<T, K>;
};