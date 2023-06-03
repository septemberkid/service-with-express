import {IsNotEmpty, IsNumber} from 'class-validator';
import {Transform} from 'class-transformer';

export default class UploadRequestDto {
    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    period_id: number

    @IsNotEmpty()
    @IsNumber()
    @Transform(({value}) => parseInt(value))
    submission_id: number
}