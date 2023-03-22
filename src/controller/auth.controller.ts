import BaseController from '@controller/base.controller';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import { Res } from 'routing-controllers';
import useHeaderMiddleware from '@middleware/header.middleware';
import useRequestMiddleware from '@middleware/request.middleware';
import AuthDto from '@dto/auth.dto';
import { requestBody } from 'inversify-express-utils/lib/decorators';
import AuthService from '@service/auth.service';

@controller('/auth')
export default class AuthController extends BaseController {
  @inject<AuthService>('AuthService')
  private _authService: AuthService;

  @httpPost(
    '/login',
    useHeaderMiddleware(),
    useRequestMiddleware(AuthDto)
  )
  async login(@requestBody() body: AuthDto, @Res() res: Response) {
    this._authService.login(body);
    return this.success(res.__('hello'));
  }
}