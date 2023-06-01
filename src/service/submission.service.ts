import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';
import SubmissionBasicDataRequestDto from '@dto/trx/submission/submission-basic-data-request.dto';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';
import SubmissionGradeDataRequestDto from '@dto/trx/submission/submission-grade-data-request.dto';
import {IUserPayload} from '@interface/request-user.interface';
import SubmissionSubmitRequestDto from '@dto/trx/submission/submission-submit-request.dto';
import SubmissionDetailInterface from '@interface/submission-detail.interface';
import SubmissionApprovalRequestDto from '@dto/trx/submission/submission-approval-request.dto';
import SubmissionProcessRequestDto from '@dto/trx/submission/submission-process-request.dto';

export default interface SubmissionService {
    getOpenSubmission(): Promise<TrxSubmissionPeriodEntity>
    getReviewSubmission(): Promise<TrxSubmissionPeriodEntity>
    saveBasicData(dto: SubmissionBasicDataRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity>
    saveGrade(dto: SubmissionGradeDataRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity>
    submit(dto: SubmissionSubmitRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity>
    detail(id: number, user: IUserPayload): Promise<SubmissionDetailInterface>
    approval(dto: SubmissionApprovalRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity>
    processSPK(dto: SubmissionProcessRequestDto, user: IUserPayload): Promise<boolean>
}