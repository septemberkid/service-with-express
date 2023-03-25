import { Request, RequestHandler, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import ValidationException from '@exception/validation.exception';

const useRequestMiddleware = <DTO extends object>(
  dto: { new (...args: string[]) : DTO },
  value: 'query' | 'body' | 'params' = 'body',
  skipMissingProperties = false,
  whitelist = true,
  forbidNonWhitelisted = true
): RequestHandler => {
  return (req: Request, res: Response, next: Function) => {
    const obj = plainToInstance(dto, req[value]);
    validate(obj, {
      skipMissingProperties,
      whitelist,
      forbidNonWhitelisted
    }).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        next(new ValidationException(errors));
      } else {
        next();
      }
    })
  };
};
export default useRequestMiddleware;
