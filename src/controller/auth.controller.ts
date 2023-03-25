import BaseController from '@controller/base.controller';
import { controller, httpPost } from 'inversify-express-utils';
import { inject } from 'inversify';
import { Request, Response } from 'express';
import { Req, Res } from 'routing-controllers';
import useHeaderMiddleware from '@middleware/header.middleware';
import useRequestMiddleware from '@middleware/request.middleware';
import { requestBody } from 'inversify-express-utils/lib/decorators';
import AuthService from '@service/auth.service';
import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';
import TYPES from '@enums/types.enum';

@controller('/auth')
export default class AuthController extends BaseController {
  @inject<AuthService>(TYPES.AUTH_SERVICE)
  private _authService: AuthService;

  @httpPost(
    '/login',
    useHeaderMiddleware(),
    useRequestMiddleware(LoginRequestDto)
  )
  async login(@requestBody() body: LoginRequestDto, @Req() req: Request, @Res() res: Response) {
    const result = await this._authService.login(body, req, res);
    return this.success(result, res.__('user_successful_login'));
  }

  @httpPost(
    '/register',
    useHeaderMiddleware(),
    useRequestMiddleware(RegisterRequestDto)
  )
  async register(@requestBody() body: RegisterRequestDto, @Req() req: Request, @Res() res: Response) {
    const result = await this._authService.register(body, req, res);
    return this.success(result, res.__('user.user_successful_registered'), 201);
  }
}