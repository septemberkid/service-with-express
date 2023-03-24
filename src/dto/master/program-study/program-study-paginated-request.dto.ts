import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';
import { IsOptional, IsString, IsUUID } from 'class-validator';

export default class ProgramStudyPaginatedRequestDto extends BasePaginatedRequestDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsUUID('4')
  public faculty_xid?: string;
}