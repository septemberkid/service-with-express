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
import SubmissionEligibleRequestDto from '@dto/trx/submission/submission-eligible-request.dto';
import {FilterQuery} from '@mikro-orm/core';
import DocumentServiceImpl from '@service/impl/document.service-impl';

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 }, // 1Mb
});
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
    @inject<DocumentServiceImpl>(TYPES.DOCUMENT_SERVICE)
    private readonly documentService: DocumentServiceImpl;

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
        const where: FilterQuery<TrxSubmissionEntity> = {}
        if (query.semester) {
            where.semester = {
                $eq: query.semester
            }
        }
        if (query.status) {
            where.status = {
                $in: query.status.split(',')
            }
        }
        if (query.period_id) {
            where.period_id = {
                $eq: query.period_id
            }
        }
        if (query.keyword) {
            where.student = {
                $or: [{
                    nim: {
                        $ilike: `%${query.keyword}%`
                    },
                }, {
                    name: {
                        $ilike: `%${query.keyword}%`
                    },
                }],
            }
        }
        const { result, meta } = await this.repo.page(
            TrxSubmissionEntity,
            where,
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
        useRoles(ROLE_ENUM.STUDENT)
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

        const data = []
        for (const entity of result) {
            const documents = await this.documentService.getFiles(entity.period_id, entity.id, entity.student.getEntity().nim)
            entity.recommendation_letter = documents.find(item => item.name === 'recommendation_letter.pdf')
            data.push(entity)
        }

        return this.paginated(data, meta);
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
        '/spk-result/:id',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(PaginationDto, 'query')
    )
    async spkResult(
        @requestQuery() query: PaginationDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validatePathParam(req, res);
        query = plainToInstance(PaginationDto, query)
        const { result, meta } = await this.viewRepo.page(
            ViewSpkResultEntity,
            {
                period_id: parseInt(req.params.id)
            },
            'rank|asc',
            {
                offset: query.offset,
                limit: query.limit
            }
        );
        return this.paginated(result, meta);
    }

    @httpPost(
        '/eligible',
        upload.single('file'),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI),
        useRequestMiddleware(SubmissionEligibleRequestDto, 'body')
    )
    async eligible(
        @requestBody() dto: SubmissionEligibleRequestDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        dto = plainToInstance(SubmissionEligibleRequestDto, dto)
        const result = await this.submissionService.eligible(dto, req.user, req.file, res);
        return this.success(result);
    }
}