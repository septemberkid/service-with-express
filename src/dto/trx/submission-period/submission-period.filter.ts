import {IsOptional, IsString} from 'class-validator';
import {PERIOD_STATUS_ENUM} from '@enums/period-status.enum';
import PaginationDto from '@dto/pagination.dto';
import {Transform} from 'class-transformer';
import {numToBoolean} from '@util/helpers';

export default class SubmissionPeriodFilter extends PaginationDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    status: PERIOD_STATUS_ENUM

    @IsOptional()
    @Transform(({value}) => numToBoolean(value, false))
    with_trash?: boolean = false;
}