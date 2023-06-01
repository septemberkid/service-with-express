import {IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength} from 'class-validator';
import {Transform} from 'class-transformer';

export default class SubmissionBasicDataRequestDto {
    @IsOptional()
    @Transform(({value}) => value ? parseInt(value) : null)
    id?: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(9)
    entry_period: string;

    @IsNotEmpty()
    @IsString()
    class: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    active_semester: number;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    period_id: number;
}