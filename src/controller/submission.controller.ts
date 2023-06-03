import BaseController from '@controller/base.controller';
import {controller, httpGet, httpPost} from 'inversify-express-utils';
import useAuthMiddleware from '@middleware/auth.middleware';
import {useRoles} from '@middleware/role.middleware';
import {ROLE_ENUM} from '@enums/role.enum';
import useRequestMiddleware from '@middleware/request.middleware';
import SubmissionBasicDataRequestDto from '@dto/trx/submission/submission-basic-data-request.dto';
import {requestBody} from 'inversify-express-utils/lib/decorators';
import {Req, Res} from 'routing-controllers';
import {RequestUserInterface} from '@interface/request-user.interface';
import {inject} from 'inversify';
import TYPES from '@enums/types.enum';
import multer from 'multer';
import SubmissionServiceImpl from '@service/impl/submission.service-impl';
import SubmissionGradeDataRequestDto from '@dto/trx/submission/submission-grade-data-request.dto';
import SubmissionFilter from '@dto/trx/submission/submission.filter';
import {requestQuery} from '@util/decorator';
import {plainToInstance} from 'class-transformer';
import SubmissionRepository from '@repository/trx/submission.repository';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';
import SubmissionSubmitRequestDto from '@dto/trx/submission/submission-submit-request.dto';
import {Response} from 'express';
import SubmissionApprovalRequestDto from '@dto/trx/submission/submission-approval-request.dto';
import SUBMISSION_STATUS from '@enums/submission-status.enum';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';
import SubmissionProcessRequestDto from '@dto/trx/submission/submission-process-request.dto';
import PaginationDto from '@dto/pagination.dto';
import ViewSpkResultEntity from '@entity/view/view-spk-result.entity';
import ViewSpkResultRepository from '@repository/view/view-spk-result.repository';

@controller(
    '/submission', 
    useAuthMiddleware
)
export default class SubmissionController extends BaseController {
    @inject<SubmissionRepository>(TYPES.SUBMISSION_REPOSITORY)
    private readonly repo: SubmissionRepository
    @inject<ViewSpkResultRepository>(TYPES.VIEW_SPK_RESULT_REPOSITORY)
    private readonly viewRepo: ViewSpkResultRepository

    @inject<SubmissionServiceImpl>(TYPES.SUBMISSION_SERVICE)
    private readonly submissionService: SubmissionServiceImpl

    @httpGet(
        '/open-period'
    )
    async openPeriod() {
        const result = await this.submissionService.getOpenSubmission();
        return this.success(result);
    }

    @httpPost(
        '/save-basic-data',
        multer().none(),
        useRoles(ROLE_ENUM.STUDENT),
        useRequestMiddleware(SubmissionBasicDataRequestDto, 'body')
    )
    async saveBasicData(
        @requestBody() dto: SubmissionBasicDataRequestDto,
        @Req() req: RequestUserInterface,
    ) {
        await this.submissionService.getOpenSubmission();
        dto = plainToInstance(SubmissionBasicDataRequestDto, dto)
        const result = await this.submissionService.saveBasicData(dto, req.user);
        return this.success(result);
    }
    @httpPost(
        '/save-grade',
        multer().none(),
        useRoles(ROLE_ENUM.STUDENT),
        useRequestMiddleware(SubmissionGradeDataRequestDto, 'body')
    )
    async saveGrade(
        @requestBody() dto: SubmissionGradeDataRequestDto,
        @Req() req: RequestUserInterface,
    ) {
        await this.submissionService.getOpenSubmission();
        dto = plainToInstance(SubmissionGradeDataRequestDto, dto)
        const result = await this.submissionService.saveGrade(dto, req.user);
        return this.success(result);
    }

    @httpPost(
        '/submit',
        multer().none(),
        useRoles(ROLE_ENUM.STUDENT),
        useRequestMiddleware(SubmissionSubmitRequestDto, 'body')
    )
    async submit(
        @requestBody() dto: SubmissionSubmitRequestDto,
        @Req() req: RequestUserInterface,
    ) {
        await this.submissionService.getOpenSubmission();
        dto = plainToInstance(SubmissionSubmitRequestDto, dto)
        const result = await this.submissionService.submit(dto, req.user);
        return this.success(result);
    }

    @httpGet(
        '',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(SubmissionFilter, 'query')
    )
    async paginatedList(
        @requestQuery() query: SubmissionFilter
    ) {
        query = plainToInstance(SubmissionFilter, query)
        const { result, meta } = await this.repo.page(
            TrxSubmissionEntity,
            {
                semester: {
                    $eq: query.semester
                },
                status: {
                    $eq: query.status
                }
            },
            query.order,
            {
                offset: query.offset,
                limit: query.limit
            }
        );
        return this.paginated(result, meta);
    }

    @httpGet(
        '/detail/:id',
    )
    async detail(
        @Req() req: RequestUserInterface,
        @Res() res: Response,
    ) {
        this.validatePathParam(req, res);
        const result = await this.submissionService.detail(
            parseInt(req.params.id),
            req.user
        );
        return this.success(result);
    }

    @httpGet(
        '/my-submissions',
    )
    async mySubmissions(
        @requestQuery() query: SubmissionFilter,
        @Req() req: RequestUserInterface,
    ) {
        query = plainToInstance(SubmissionFilter, query)
        const { result, meta } = await this.repo.page(
            TrxSubmissionEntity,
            {
                student_id: req.user.additional_info.id,
                semester: {
                    $eq: query.semester
                },
                status: {
                    $eq: query.status
                }
            },
            query.order,
            {
                offset: query.offset,
                limit: query.limit
            },
            false,
            [
                'student'
            ]
        );
        return this.paginated(result, meta);
    }

    @httpPost(
        '/approval',
        multer().none(),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(SubmissionApprovalRequestDto, 'body')
    )
    async approval(
        @requestBody() dto: SubmissionApprovalRequestDto,
        @Req() req: RequestUserInterface,
    ) {
        dto = plainToInstance(SubmissionApprovalRequestDto, dto)
        if (!Object.values(SUBMISSION_STATUS).includes(dto.status))
            throw ValidationException.newError('status', VALIDATION.INVALID_PARAM, 'Invalid param of status! (APPROVED, REJECTED)')
        const result = await this.submissionService.approval(dto, req.user);
        return this.success(result);
    }

    @httpPost(
        '/process-spk',
        multer().none(),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(SubmissionProcessRequestDto, 'body')
    )
    async processSpk(
        @requestBody() dto: SubmissionProcessRequestDto,
        @Req() req: RequestUserInterface,
    ) {
        dto = plainToInstance(SubmissionProcessRequestDto, dto)
        const result = await this.submissionService.processSPK(dto, req.user);
        return this.success(result);
    }

    @httpGet(
        '/spk-result',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(PaginationDto, 'query')
    )
    async spkResult(
        @requestQuery() query: PaginationDto
    ) {
        query = plainToInstance(PaginationDto, query)
        const { result, meta } = await this.viewRepo.page(
            ViewSpkResultEntity,
            {},
            query.order,
            {
                offset: query.offset,
                limit: query.limit
            }
        );
        return this.paginated(result, meta);
    }
}