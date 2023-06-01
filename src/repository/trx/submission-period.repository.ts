import {injectable} from 'inversify';
import BaseRepository from '@repository/base.repository';
import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';
import SubmissionPeriodRequestDto from '@dto/trx/submission-period/submission-period-request.dto';
import {RequestUserInterface} from '@interface/request-user.interface';
import PERIOD_STATUS from '@enums/period-status.enum';
import {isEmpty} from '@util/helpers';

@injectable()
export default class SubmissionPeriodRepository extends BaseRepository<TrxSubmissionPeriodEntity>{
    async save(
        dto: SubmissionPeriodRequestDto,
        req: RequestUserInterface,
    ) {
        if (isEmpty(dto.id)) {
            return this.insert(dto, req);
        }
        return this.update(dto, req);
    }
    
    private async insert(
        dto: SubmissionPeriodRequestDto,
        req: RequestUserInterface
    ) {
        const entity = this.create({
            name: dto.name,
            open_start_date: dto.open_start_date,
            open_end_date: dto.open_end_date,
            review_start_date: dto.review_start_date,
            review_end_date: dto.review_end_date,
            created_by: {
                id: req.user.id,
                name: req.user.name
            },
            status: PERIOD_STATUS.OPEN,
        })
        await this.em.persistAndFlush(entity);
        return entity;
    }
    private async update(
        dto: SubmissionPeriodRequestDto,
        req: RequestUserInterface,
    ) {
        const entity = await this.retrieve(dto.id);
        entity.name = dto.name;
        entity.open_start_date = dto.open_start_date;
        entity.open_end_date = dto.open_end_date;
        entity.review_start_date = dto.review_start_date;
        entity.review_end_date = dto.review_end_date;
        entity.status = dto.status;
        entity.updated_by = {
            id: req.user.id,
            name: req.user.name
        }
        await this.em.persistAndFlush(entity);
        return entity;
    }
}