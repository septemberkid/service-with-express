import AppUserEntity from '@entity/app/app-user.entity';

export default class AuthResponseDto {
  readonly token: string;
  readonly user: AppUserEntity;
  readonly roles: string[];

  constructor(params: {
    token: string,
    user: AppUserEntity,
    roles: string[],
  }) {
    this.token = params.token;
    this.user = params.user;
    this.roles = params.roles;
  }
}