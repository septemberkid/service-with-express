import { inject, injectable } from 'inversify';
import AppUserRepository from '@repository/app-user.repository';
import AuthDto from '@dto/auth.dto';

@injectable()
export default class AuthService {
  @inject<AppUserRepository>('AppUserRepository')
  private _appUserRepository: AppUserRepository;
  
  
  public login(authDto: AuthDto) : void {
    console.log(authDto)
  }
}