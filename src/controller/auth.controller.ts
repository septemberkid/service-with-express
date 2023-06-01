import BaseController from '@controller/base.controller';
import { controller, httpPost } from 'inversify-express-utils';
import {inject} from 'inversify';
import { Request, Response } from 'express';
import { Req, Res } from 'routing-controllers';
import useRequestMiddleware from '@middleware/request.middleware';
import { requestBody } from 'inversify-express-utils/lib/decorators';
import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';
import TYPES from '@enums/types.enum';
import RefreshTokenRequestDto from '@dto/auth/refresh-token-request.dto';
import multer from 'multer';
import AuthServiceImpl from '@service/impl/auth.service-impl';

@controller('/auth')
export default class AuthController extends BaseController {
  @inject<AuthServiceImpl>(TYPES.AUTH_SERVICE)
  private _authService: AuthServiceImpl;

  @httpPost(
    '/authorize',
    multer().none(),
    useRequestMiddleware(LoginRequestDto)
  )
  async authorize(@requestBody() body: LoginRequestDto, @Req() req: Request, @Res() res: Response) {
    const result = await this._authService.authorize(body, req, res);
    return this.success(result, res.__('authorized'));
  }

  @httpPost(
    '/refresh-token',
    multer().none(),
    useRequestMiddleware(RefreshTokenRequestDto)
  )
  async refreshToken(@requestBody() body: RefreshTokenRequestDto, @Req() req: Request, @Res() res: Response) {
    const result = await this._authService.refreshToken(body, req, res);
    return this.success(result, res.__('refresh_token.successful'));
  }

  @httpPost(
    '/register',
    multer().none(),
    useRequestMiddleware(RegisterRequestDto)
  )
  async register(@requestBody() body: RegisterRequestDto, @Req() req: Request, @Res() res: Response) {
    const result = await this._authService.register(body, req, res);
    return this.success(result, res.__('user.user_successful_registered'), 201);
  }
}