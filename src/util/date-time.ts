import moment from 'moment';
export const isValidFormat = (input: string, format: string): boolean =>
  moment(input, format).isValid();
export const nextMinutes = (
  input: string,
  format: string,
  minutes: number
): string => moment(input, format).add(minutes, 'minutes').format(format);
export const isTimeNowOrAfter = (input: string, format: string): boolean => {
  const _m1 = moment(input, format).valueOf();
  const _m2 = moment(moment(), format).valueOf();
  return _m1 >= _m2;
};
