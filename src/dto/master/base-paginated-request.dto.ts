import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
export default class BasePaginatedRequestDto {
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  public limit?: number = 10;
  
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  public offset?: number = 0;

  @IsOptional()
  @IsString()
  public order?: string;
}