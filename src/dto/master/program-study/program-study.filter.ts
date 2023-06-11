import PaginationDto from '@dto/pagination.dto';
import {IsNumber, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';
import {numToBoolean} from '@util/helpers';

export default class ProgramStudyFilter extends PaginationDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @Transform(({value}) => numToBoolean(value, true))
    is_active?: boolean;

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    faculty_id?: number;
}