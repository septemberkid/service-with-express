import { IsEmail, IsString, IsNotEmpty, MinLength } from 'class-validator';

export default class AuthDto {
  @IsNotEmpty({ message: 'Email wajib diisi' })
  @MinLength(10, { message: 'Email minimal 10 karakter' })
  @IsEmail({ domain_specific_validation: true })
  public static email?: string;

  @IsNotEmpty({ message: 'Password wajib diisi' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @IsString()
  public static password?: string;
}
