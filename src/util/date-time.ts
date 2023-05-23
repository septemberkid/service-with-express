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

export const nowAsTimestamp = () : string => moment().format('YYYY-MM-DD hh:mm:ss');
export const epoch = (amount: number): number => Math.floor(amount/1000);
export const generateTokenExpired = (amountSecond: number): number => epoch(moment().add(amountSecond,'seconds').valueOf());
export const generateRefreshTokenExpired = (): {text: string, seconds: number} => {
  const now = moment().add(1, 'month');
  return {
    text: now.format('YYYY-MM-DD hh:mm:ss'),
    seconds: now.unix()
  }
}
export const isExpired = (timestamp: string) => {
  return !isTimeNowOrAfter(timestamp, 'YYYY-MM-DD hh:mm:ss')
}
