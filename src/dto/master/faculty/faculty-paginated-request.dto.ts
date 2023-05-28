import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';
import {IsOptional, IsString} from 'class-validator';
import {Expose, Transform} from 'class-transformer';
import {numToBoolean} from '@util/helpers';

export default class FacultyPaginatedRequestDto extends BasePaginatedRequestDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @Expose({name: 'is_active'})
  @Transform(({ value }) => numToBoolean(value, true))
  public isActive?: boolean;
}