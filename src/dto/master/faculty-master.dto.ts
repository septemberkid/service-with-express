import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export default class FacultyMasterDto {
  @IsNotEmpty()
  @MinLength(85)
  @IsEmail()
  public name: string;
}