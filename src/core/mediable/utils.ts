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