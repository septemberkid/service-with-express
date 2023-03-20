import BaseController from '@controller/base.controller';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import TYPES from '@enums/types.enum';
import winston from 'winston';
import { Request, Response } from 'express';
import { Req, Res } from 'routing-controllers';
import useHeaderMiddleware from '@middleware/header.middleware';
import useRequestMiddleware from '@middleware/request.middleware';
import AuthDto from '@dto/auth.dto';

@controller('/auth')
export default class AuthController extends BaseController {
  @inject(TYPES.LOGGER)
  private readonly _logger: winston.Logger;

  @httpPost(
    '/login',
    useHeaderMiddleware(),
    useRequestMiddleware(AuthDto)
  )
  async login(@Req() req: Request, @Res() res: Response) {
    return this.success(res.__('hello'));
  }
}
