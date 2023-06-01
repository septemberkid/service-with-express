import {IsEmail, IsNotEmpty, IsNumber, MaxLength, MinLength} from 'class-validator';
import { SpecificEmailDomain } from '@util/decorator';
import {Transform} from 'class-transformer';

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
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  public faculty_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({value}) => parseInt(value))
  public study_program_id: number;
}