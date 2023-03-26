import { NextFunction, Request, Response } from 'express';
import HttpException from '@exception/http.exception';
import { CLIENTS, RegisteredClient } from '../config/client';
import Encryptor from '@util/encryptor';
import { isTimeNowOrAfter, isValidFormat, nextMinutes } from '@util/date-time';
import { APP_HKEY_EXPIRED } from '@config';

const useClientMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  validate(req, res, _next);
  validationHkey(req, res, _next);
  return _next();
};

const VALID_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

const validate = (request: Request, res: Response, _next: NextFunction) => {
  // make sure x-client-name is required
  if (!request.headers['x-client-name']) {
    _next(new HttpException(400, res.__('client.required_client_name')));
  }
  // make sure x-key is required
  if (!request.headers['x-key']) {
    _next(new HttpException(400, res.__('client.required_key')));
  }
  // make sure x-timestamp is required
  if (!request.headers['x-timestamp']) {
    _next(new HttpException(400, res.__('client.required_timestamp')));
  }
  // make sure x-timestamp format is valid
  if (!isValidFormat(request.headers['x-timestamp'] as string, VALID_FORMAT)) {
    _next(new HttpException(400, res.__('client.invalid_timestamp_format')));
  }
  if (
    !Object.keys(CLIENTS).find((k) => k === request.headers['x-client-name'])
  ) {
    _next(new HttpException(401, res.__('client.invalid_client')));
  }
};
const validationHkey = (
  request: Request,
  res: Response,
  _next: NextFunction
) => {
  const clientName = request.headers['x-client-name'] as string;
  const timestamp = request.headers['x-timestamp'] as string;
  const key = request.headers['x-key'] as string;
  const registeredClient: RegisteredClient = CLIENTS[clientName];
  const combined = [
    registeredClient.clientId,
    registeredClient.clientSecret,
    timestamp,
  ]
    .join(':')
    .toString();
  const generatedHkey = Encryptor.sha256(combined).substring(0, 42);
  if (generatedHkey !== key) {
    _next(new HttpException(401, res.__('client.invalid_key')));
  }
  const exp = nextMinutes(
    timestamp,
    VALID_FORMAT,
    Number(APP_HKEY_EXPIRED) || 0
  );
  if (!isTimeNowOrAfter(exp, VALID_FORMAT)) {
    _next(new HttpException(401, res.__('client.expired_key')));
  }
};
export default useClientMiddleware;
