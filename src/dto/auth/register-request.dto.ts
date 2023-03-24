import { IsNotEmpty, MinLength, MaxLength, IsEmail } from 'class-validator';
import { SpecificEmailDomain } from '@util/decorator';

export default class RegisterRequestDto {
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(12)
  public nim: string;
  
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