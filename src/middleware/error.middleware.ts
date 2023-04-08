import { NextFunction, Request, Response } from 'express';
import HttpException from '@exception/http.exception';
import { Logger } from '@util/logger';
import ResponseDto from '@dto/response.dto';
import ValidationException from '@exception/validation.exception';
import { MulterError } from 'multer';
import { Configuration } from '@core/config';

const config = Configuration.instance();
const useErrorMiddleware = (
  error: HttpException,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const logger = new Logger();
    if (error instanceof ValidationException) {
      return handleValidationException(res, error);
    }
    if (error instanceof MulterError) {
      return handleValidationException(res, ValidationException.newError(error.field, error.code, error.message));
    }
    const httpCode: number = error.httpCode || 500;
    const message: string = error.message || res.__('error.general');

    console.error(
      `[${req.method}] ${req.path} >> HttpCode:: ${httpCode}, Message:: ${message}`
    );
    if (config.get('NODE_ENV') === 'production') {
      logger.logMessage(
        `[${req.method}] ${req.path} >> HttpCode:: ${httpCode}, Message:: ${message}`, 'error'
      );
    }
    const response = ResponseDto.fail(message);
    res.status(httpCode).json(response);
  } catch (error) {
    _next(error);
  }
};

const handleValidationException = (res: Response, validationException: ValidationException) => {
  return res.status(400).json(ResponseDto.validator(validationException.validations))
}

export default useErrorMiddleware;
