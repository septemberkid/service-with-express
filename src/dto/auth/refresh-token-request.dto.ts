import { IsNotEmpty, IsUUID } from 'class-validator';

export default class RefreshTokenRequestDto {

  @IsNotEmpty()
  @IsUUID(5)
  public refresh_token: string;
}