import { Request, RequestHandler, Response } from 'express';
import HttpException from '@exception/http.exception';

const useHeaderMiddleware = (json = true): RequestHandler => {
  return (req: Request, res: Response, next: Function) => {
    const headers = req.headers;
    if (json && headers['content-type'] != 'application/json') {
      next(new HttpException(400, res.__('error.invalid_content_type')));
    }
    return next();
  };
};
export default useHeaderMiddleware;
