import PaginationDto from '@dto/pagination.dto';
import {IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';
import {numToBoolean} from '@util/helpers';

export default class FacultyFilter extends PaginationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Transform(({value}) => numToBoolean(value, true))
    is_active?: boolean;
}