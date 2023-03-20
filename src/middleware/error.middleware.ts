import { NextFunction, Request, Response } from 'express';
import HttpException from '@exception/http.exception';
import Logger from '@util/logger';
import ResponseDto from '@dto/response.dto';
import { NODE_ENV } from '@config';

const useErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const httpCode: number = error.httpCode || 500;
    const message: string = error.message || res.__('error.general');

    console.error(
      `[${req.method}] ${req.path} >> HttpCode:: ${httpCode}, Message:: ${message}`
    );
    if (NODE_ENV === 'production') {
      Logger.error(
        `[${req.method}] ${req.path} >> HttpCode:: ${httpCode}, Message:: ${message}`
      );
    }
    const response = ResponseDto.fail(message);
    res.status(httpCode).json(response);
  } catch (error) {
    _next(error);
  }
};
export default useErrorMiddleware;
