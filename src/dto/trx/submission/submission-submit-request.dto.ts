import {IsNotEmpty} from 'class-validator';
import {Transform} from 'class-transformer';

export default class  SubmissionSubmitRequestDto {
    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    id: number;
}