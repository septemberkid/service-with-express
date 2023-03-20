import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class AuthDto {
  @IsNotEmpty()
  @MinLength(10)
  @IsEmail()
  public email?: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsString()
  public password?: string;
}
