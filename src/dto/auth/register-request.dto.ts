import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { SpecificEmailDomain } from '@util/decorator';
import {Expose} from 'class-transformer';

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
  @Expose({name: 'faculty_id'})
  public facultyId: number;

  @IsNotEmpty()
  @Expose({name: 'study_program_id'})
  public studyProgramId: number;
}