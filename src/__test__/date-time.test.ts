import { generateTokenExpired } from '@util/date-time';

describe('date-time', () => {
  test('token-expired-time', () => {
    const exp = generateTokenExpired(3600);
    console.log(exp)
  })
})