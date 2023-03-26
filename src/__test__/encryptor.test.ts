import Encryptor from '@util/encryptor';

describe('encryptor', () => {
  test('encode-base-64', () => {
    const base64 = Encryptor.base64Encode('12345678')
    expect(base64).toEqual('MTIzNDU2Nzg=')
  });
  test('decode-base-64', () => {
    const base64 = Encryptor.base64Decode('MTIzNDU2Nzg=')
    expect(base64).toEqual('12345678')
  });
  test('hash-bcrypt', async () => {
    const plain = '12345678';
    const hash = await Encryptor.hashBcrypt(plain);
    const isMatched = await Encryptor.compareBcrypt(plain, hash);
    expect(isMatched).toEqual(true)
  });
})