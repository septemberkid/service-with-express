import {IsNotEmpty, ValidateIf} from 'class-validator';
import {Transform} from 'class-transformer';
import SUBMISSION_STATUS, {SUBMISSION_STATUS_ENUM} from '@enums/submission-status.enum';

export default class  SubmissionApprovalRequestDto {
    @IsNotEmpty()
    @Transform(({value}) => value ? parseInt(value) : null)
    submission_id: number;

    @IsNotEmpty()
    @Transform(({value}) => value ? parseFloat(value) : null)
    achievement: number;

    @IsNotEmpty()
    status: SUBMISSION_STATUS_ENUM;

    @IsNotEmpty()
    @ValidateIf(object => object.status === SUBMISSION_STATUS.REJECTED)
    reason: string;
}