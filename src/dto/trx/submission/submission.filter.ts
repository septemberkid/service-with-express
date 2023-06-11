import {IsNotEmpty, IsNumber, IsOptional, IsString} from 'class-validator';
import PaginationDto from '@dto/pagination.dto';
import {Transform} from 'class-transformer';
import {SUBMISSION_STATUS_ENUM} from '@enums/submission-status.enum';

export default class SubmissionFilter extends PaginationDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    period_id: number

    @IsOptional()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    semester: number;

    @IsOptional()
    @IsString()
    status: SUBMISSION_STATUS_ENUM

    @IsOptional()
    @IsString()
    keyword: string;
}