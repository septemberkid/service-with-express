import {IsNotEmpty, IsOptional, IsString, ValidateIf} from 'class-validator';
import {Transform} from 'class-transformer';
import {PERIOD_STATUS_ENUM} from '@enums/period-status.enum';

export default class SubmissionPeriodRequestDto {
    @IsOptional()
    @Transform(({value}) => value ? parseInt(value) : null)
    id?: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    open_start_date: string;

    @IsNotEmpty()
    @IsString()
    open_end_date: string;

    @IsNotEmpty()
    @IsString()
    review_start_date: string;

    @IsNotEmpty()
    @IsString()
    review_end_date: string;

    @IsNotEmpty()
    @IsString()
    @ValidateIf( o => o.id != null)
    status: PERIOD_STATUS_ENUM
}