import { inject, injectable } from 'inversify';
import AppUserRepository from '@repository/app-user.repository';
import RegisterRequestDto from '@dto/auth/register-request.dto';
import LoginRequestDto from '@dto/auth/login-request.dto';

@injectable()
export default class AuthService {
  @inject<AppUserRepository>('AppUserRepository')
  private _appUserRepository: AppUserRepository;
  
  
  public login(loginRequestDto: LoginRequestDto) : void {
    console.log(loginRequestDto)
  }

  public register(registerRequestDto: RegisterRequestDto): void {
    // check if email not yet registered
  }
}