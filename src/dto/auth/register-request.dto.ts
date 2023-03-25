import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SpecificEmailDomain } from '@util/decorator';

export default class RegisterRequestDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  public nim: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  public full_name: string;
  
  @IsNotEmpty()
  @IsEmail()
  @SpecificEmailDomain('widyatama.ac.id')
  public email: string;

  @IsNotEmpty()
  @MinLength(8)
  public password: string;

  @IsNotEmpty()
  public faculty_xid: string;

  @IsNotEmpty()
  public study_program_xid: string;
}