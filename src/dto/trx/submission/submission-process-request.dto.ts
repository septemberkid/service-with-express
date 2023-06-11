import {IsNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';

export default class SubmissionProcessRequestDto {
    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    period_id: number;
}