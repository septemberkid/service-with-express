import { IsNotEmpty, MinLength, IsEmail } from 'class-validator';
import { SpecificEmailDomain } from '@util/decorator';

export default class LoginRequestDto {

  @IsNotEmpty()
  @IsEmail()
  @SpecificEmailDomain('widyatama.ac.id')
  public email: string;

  @IsNotEmpty()
  @MinLength(8)
  public password: string;
}