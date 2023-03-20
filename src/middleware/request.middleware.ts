import { Request, RequestHandler, Response } from 'express';

const useRequestMiddleware = <DTO>(
  dto: DTO,
  value: 'query' | 'body' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return (req: Request, res: Response, next: Function) => {
    console.log(req[value]);
    return next();
  };
};

export default useRequestMiddleware;
