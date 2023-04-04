import { SignJWT, jwtVerify } from 'jose';
import { JWT_EXPIRED, JWT_ISSUER, JWT_SECRET } from '@config';
import JwtPayloadInterface from '@interface/jwt-payload.interface';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import Crypto from 'crypto';
import { generateTokenExpired } from '@util/date-time';
import { IUserPayload } from '@interface/request-user.interface';

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
      .setExpirationTime(generateTokenExpired(JWT_EXPIRED))
      .sign(secret);
  }
  static verifyToken = async (token: string, audience: string): Promise<IUserPayload> => {
    const {payload} = await jwtVerify(token, secret, {
      issuer: JWT_ISSUER || 'web_service',
      audience
    });
    return {
      xid: payload.xid as string,
      name: payload.full_name as string,
      roles: payload.roles as string[],
      type: payload.user_type as string
    }
  }
  static md5(plain: string): string {
    return Crypto.createHash('md5').update(plain).digest('hex');
  }
  static hashBcrypt(plain: string) : Promise<string> {
    const salt = genSaltSync(10);
    return hashSync(plain, salt);
  }
  static compareBcrypt(plain: string, hash: string) : Promise<boolean> {
    return compareSync(plain, hash);
  }
}
