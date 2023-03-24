import BaseController from '@controller/base.controller';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Response } from 'express';
import { Res } from 'routing-controllers';
import useHeaderMiddleware from '@middleware/header.middleware';
import useRequestMiddleware from '@middleware/request.middleware';
import { requestBody } from 'inversify-express-utils/lib/decorators';
import AuthService from '@service/auth.service';
import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';

@controller('/auth')
export default class AuthController extends BaseController {
  @inject<AuthService>('AuthService')
  private _authService: AuthService;

  @httpPost(
    '/login',
    useHeaderMiddleware(),
    useRequestMiddleware(LoginRequestDto)
  )
  async login(@requestBody() body: LoginRequestDto, @Res() res: Response) {
    this._authService.login(body);
    return this.success(res.__('hello'));
  }

  @httpPost(
    '/register',
    useHeaderMiddleware(),
    useRequestMiddleware(RegisterRequestDto)
  )
  async register(@requestBody() body: RegisterRequestDto, @Res() res: Response) {
    return this.success(res.__('hello'));
  }
}