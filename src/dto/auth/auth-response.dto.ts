export default class AuthResponseDto {
  readonly token: string;
  readonly refresh_token: string;

  constructor(params: {
    token: string,
    refresh_token: string,
  }) {
    this.token = params.token;
    this.refresh_token = params.refresh_token;
  }
}