import { getExtension } from '@util/helpers';

export const isValidExtension = (filename: string, allowedExtension: string) => {
  const extension = getExtension(filename);
  return extension === allowedExtension;
}