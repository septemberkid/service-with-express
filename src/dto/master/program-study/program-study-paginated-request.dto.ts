import BasePaginatedRequestDto from '@dto/master/base-paginated-request.dto';
import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Expose, Transform} from 'class-transformer';
import {numToBoolean} from '@util/helpers';

export default class ProgramStudyPaginatedRequestDto extends BasePaginatedRequestDto {
  @IsOptional()
  @IsString()
  public name?: string;

  @IsOptional()
  @IsNumber()
  @Expose({name: 'faculty_id'})
  @Transform(({ value }) => parseInt(value))
  public facultyId?: number;

  @IsOptional()
  @Expose({name: 'is_active'})
  @Transform(({ value }) => numToBoolean(value, true))
  public isActive?: boolean;
}