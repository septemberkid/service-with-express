import { SignJWT } from 'jose';
import { JWT_EXPIRED, JWT_ISSUER, JWT_SECRET } from '@config';
import JwtPayloadInterface from '@interface/jwt-payload.interface';
import { Buffer } from 'buffer';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import Crypto from 'crypto';

const secret = new TextEncoder().encode(JWT_SECRET);
export default class Encryptor {
  static sha256(data: string) {
    return Crypto.createHash('sha256').update(data).digest('hex');
  }
  static generateJWT = (payload: JwtPayloadInterface, audience: string) : Promise<string> => {
    return new SignJWT({
      ...payload
    })
      .setProtectedHeader({
        alg: 'HS256'
      })
      .setIssuedAt()
      .setIssuer(JWT_ISSUER || 'web_service')
      .setAudience(audience)
      .setExpirationTime(JWT_EXPIRED)
      .sign(secret);
  }
  static base64Encode(data: string) {
    return Buffer.from(data, 'utf8').toString('base64');
  }
  static base64Decode(encoded: string) {
    return Buffer.from(encoded, 'base64').toString('utf8');
  }
  static hashBcrypt(plain: string) : Promise<string> {
    const salt = genSaltSync(10);
    return hashSync(plain, salt);
  }
  static compareBcrypt(plain: string, hash: string) : Promise<boolean> {
    return compareSync(plain, hash);
  }
}
