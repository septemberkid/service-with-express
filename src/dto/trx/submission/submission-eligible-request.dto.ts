import {IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {Transform} from 'class-transformer';
import {ACTION_ENUM} from '@enums/action.enum';

export default class  SubmissionEligibleRequestDto {
    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    period_id: number;

    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    submission_id: number;

    @IsNotEmpty()
    @IsString()
    action: ACTION_ENUM;

    @IsOptional()
    file: Express.Multer.File;

    @IsOptional()
    reason: string;
}