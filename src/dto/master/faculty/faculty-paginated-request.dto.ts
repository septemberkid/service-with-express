import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';
import { IsOptional, IsString } from 'class-validator';

export default class FacultyPaginatedRequestDto extends BasePaginatedRequestDto {
  @IsOptional()
  @IsString()
  public name?: string;
}