import { SignJWT, jwtVerify } from 'jose';
import JwtPayloadInterface from '@interface/jwt-payload.interface';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import Crypto from 'crypto';
import { generateTokenExpired } from '@util/date-time';
import { IUserPayload } from '@interface/request-user.interface';
import {Configuration} from '@core/config';
export default class Encryptor {
  static sha256(data: string) {
    return Crypto.createHash('sha256').update(data).digest('hex');
  }
  static generateJWT = (params: {
    payload: JwtPayloadInterface,
    audience: string,
    expired?: number,
  }): Promise<string> => {
    const config = Configuration.instance();
    const secret: string = config.get('JWT_SECRET');
    const issuer: string = config.get('JWT_ISSUER')

    const sec = new TextEncoder().encode(secret);
    return new SignJWT({
      ...params.payload
    })
      .setProtectedHeader({
        alg: 'HS256'
      })
      .setIssuedAt()
      .setIssuer(issuer)
      .setAudience(params.audience)
      .setExpirationTime(generateTokenExpired(params.expired || 3600))
      .sign(sec);
  }
  static verifyToken = async (params: {
    token: string,
    audience: string,
  }): Promise<IUserPayload> => {
    const config = Configuration.instance();
    const secret: string = config.get('JWT_SECRET');
    const issuer: string = config.get('JWT_ISSUER')
    const sec = new TextEncoder().encode(secret);
    const {payload} = await jwtVerify(params.token, sec, {
      issuer: issuer,
      audience: params.audience
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
