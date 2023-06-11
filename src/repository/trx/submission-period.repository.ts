import BaseRepository from '@repository/base.repository';
import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';
import SubmissionPeriodRequestDto from '@dto/trx/submission-period/submission-period-request.dto';
import {RequestUserInterface} from '@interface/request-user.interface';
import PERIOD_STATUS from '@enums/period-status.enum';
import {isEmpty} from '@util/helpers';
import {injectable} from 'inversify';
import HttpException from '@exception/http.exception';
import {now} from '@util/date-time';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';
import SUBMISSION_STATUS from '@enums/submission-status.enum';

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
        // check if period exist
        const exist = await this.find({
            status: PERIOD_STATUS.OPEN,
            start_date: {
                $gte: dto.start_date
            },
            end_date: {
                $lte: dto.end_date
            },
            deleted_at: null,
            deleted_by: null
        })
        if (exist.length > 0)
            throw new HttpException(400, 'Period sedang terbuka dalam rentang tanggal yang sama.')
         const entity = this.create({
            name: dto.name,
            start_date: dto.start_date,
            end_date: dto.end_date,
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
        entity.start_date = dto.start_date;
        entity.end_date = dto.end_date;
        entity.status = dto.status;
        entity.updated_by = {
            id: req.user.id,
            name: req.user.name
        }
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async autoSubmitAndClose() {
        await this.em.begin();
        try {
            const today = now('YYYY-MM-DD');
            const periodList = await this.em.find(TrxSubmissionPeriodEntity, {
                status: PERIOD_STATUS.OPEN,
                end_date: {
                    $eq: today
                },
                deleted_at: null,
                deleted_by: null
            });
            if (periodList.length > 0) {
                for (const period of periodList) {
                    period.status = PERIOD_STATUS.CLOSED;
                    await this.em.nativeUpdate(TrxSubmissionEntity, {
                        period_id: period.id,
                    }, {
                        status: SUBMISSION_STATUS.SUBMITTED
                    })
                    await this.em.persistAndFlush(period);
                }
                await this.em.commit();
            }
        } catch (e) {
            await this.em.rollback();
            throw e;
        }
    }
}