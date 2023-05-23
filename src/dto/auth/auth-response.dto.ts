export default class AuthResponseDto {
  readonly token: string;
  readonly refresh_token: string;
  readonly refresh_token_lifetime: number;

  constructor(params: {
    token: string,
    refresh_token: string,
    refresh_token_lifetime: number
  }) {
    this.token = params.token;
    this.refresh_token = params.refresh_token;
    this.refresh_token_lifetime = params.refresh_token_lifetime
  }
}