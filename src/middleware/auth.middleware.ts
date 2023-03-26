import { NextFunction, Response } from 'express';
import HttpException from '@exception/http.exception';
import Encryptor from '@util/encryptor';
import { RequestUserInterface } from '@interface/request-user.interface';

const useAuthMiddleware = async (req: RequestUserInterface, res: Response, next: NextFunction) => {
  // has the Authorization header?
  const authorization = req.headers['authorization'] as string;
  const clientName = req.headers['x-client-name'] as string;
  if(!authorization) throw new HttpException(401, res.__('token.required'));
  if (authorization.substring(0, 6) != 'Bearer')
    throw new HttpException(401, res.__('token.bearer'));
  const token = authorization.split('Bearer ')[1];
  try {
    req.user = await Encryptor.verifyToken(token, clientName);
    next()
  } catch (e) {
    if (e.name === 'JWTExpired') {
      next(new HttpException(401, res.__('token.expired')))
      return;
    }
    next(new HttpException(401, res.__('token.invalid')))
  }
}
export default useAuthMiddleware;