import {controller, httpDelete, httpGet, httpPost, httpPut} from 'inversify-express-utils';
import useAuthMiddleware from '@middleware/auth.middleware';
import {useRoles} from '@middleware/role.middleware';
import {ROLE_ENUM} from '@enums/role.enum';
import BaseController from '@controller/base.controller';
import {inject} from 'inversify';
import SubmissionPeriodRepository from '@repository/trx/submission-period.repository';
import TYPES from '@enums/types.enum';
import useRequestMiddleware from '@middleware/request.middleware';
import SubmissionPeriodFilter from '@dto/trx/submission-period/submission-period.filter';
import {requestQuery} from '@util/decorator';
import {plainToInstance} from 'class-transformer';
import {Req, Res} from 'routing-controllers';
import {RequestUserInterface} from '@interface/request-user.interface';
import {Response} from 'express';
import multer from 'multer';
import SubmissionPeriodRequestDto from '@dto/trx/submission-period/submission-period-request.dto';
import moment from 'moment';
import {requestBody} from 'inversify-express-utils/lib/decorators';
import ValidationException from '@exception/validation.exception';
import VALIDATION from '@enums/validation.enum';
import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';

@controller(
    '/submission-period',
    useAuthMiddleware,
)
export default class SubmissionPeriodController extends BaseController {
    @inject<SubmissionPeriodRepository>(TYPES.SUBMISSION_PERIOD_REPOSITORY)
    private readonly repo: SubmissionPeriodRepository

    private validateDateFormat(dto: SubmissionPeriodRequestDto, res: Response) {
        if (!moment(dto.start_date, 'YYYY-MM-DD', true).isValid())
            throw ValidationException.newError('start_date', VALIDATION.INVALID_DATE_FORMAT, res.__('validation.date.invalid_date_format', {format: 'YYYY-MM-DD'}));
        if (!moment(dto.end_date, 'YYYY-MM-DD', true).isValid())
            throw ValidationException.newError('end_date', VALIDATION.INVALID_DATE_FORMAT, res.__('validation.date.invalid_date_format', {format: 'YYYY-MM-DD'}));
        if (!moment(dto.start_date).isBefore(moment(dto.end_date)))
            throw ValidationException.newError('start_date', VALIDATION.INVALID_END_DATE, 'The open end date must be set after the open start date.');
    }

    @httpGet(
        '',
        useRequestMiddleware(SubmissionPeriodFilter, 'query'),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI, ROLE_ENUM.STUDENT)
    )
    async paginatedList(
        @requestQuery() query: SubmissionPeriodFilter
    ) {
        query = plainToInstance(SubmissionPeriodFilter, query)
        const { result, meta } = await this.repo.page(
            TrxSubmissionPeriodEntity,
            {
                start_date: {
                    $lte: query.start_date,
                },
                end_date: {
                    $gte: query.end_date,
                },
                name: {
                    $ilike: query.name
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
            query.with_trash
        );
        return this.paginated(result, meta);
    }

    @httpGet(
        '/:id',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI, ROLE_ENUM.STUDENT)
    )
    async retrieve(
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validatePathParam(req, res);
        const result = await this.repo.retrieve({
            id: parseInt(req.params.id)
        })
        return this.success(result);
    }

    @httpPost(
        '',
        multer().none(),
        useRequestMiddleware(SubmissionPeriodRequestDto, 'body'),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI)
    )
    async create(
        @requestBody() dto: SubmissionPeriodRequestDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validateDateFormat(dto, res);
        const result = await this.repo.save(dto, req);
        return this.success(result);
    }

    @httpPut(
        '',
        multer().none(),
        useRequestMiddleware(SubmissionPeriodRequestDto, 'body'),
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI)
    )
    async update(
        @requestBody() dto: SubmissionPeriodRequestDto,
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validateDateFormat(dto, res);
        if (!dto.status) {
            delete dto.status
        }
        const result = await this.repo.save(dto, req);
        return this.success(result);
    }

    @httpDelete(
        '/:id',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI)
    )
    async delete(
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validatePathParam(req, res);
        const result = await this.repo.softDelete({
            id: parseInt(req.params.id)
        }, req)
        return this.success(result);
    }

    @httpPost(
        '/restore/:id',
        useRoles(ROLE_ENUM.KAPRODI, ROLE_ENUM.SEKPRODI)
    )
    async restore(
        @Req() req: RequestUserInterface,
        @Res() res: Response
    ) {
        this.validatePathParam(req, res);
        const result = await this.repo.restore({
            id: parseInt(req.params.id)
        })
        return this.success(result);
    }
}