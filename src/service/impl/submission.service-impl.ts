import {provide} from 'inversify-binding-decorators';
import TYPES from '@enums/types.enum';
import SubmissionBasicDataRequestDto from '@dto/trx/submission/submission-basic-data-request.dto';
import {inject} from 'inversify';
import {PostgreSqlDriver, SqlEntityManager} from '@mikro-orm/postgresql';
import SubmissionPeriodRepository from '@repository/trx/submission-period.repository';
import PERIOD_STATUS from '@enums/period-status.enum';
import {now, nowAsTimestamp} from '@util/date-time';
import HttpException from '@exception/http.exception';
import AuthService from '@service/auth.service';
import SubmissionService from '@service/submission.service';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';
import SubmissionGradeDataRequestDto from '@dto/trx/submission/submission-grade-data-request.dto';
import {IUserPayload} from '@interface/request-user.interface';
import SUBMISSION_STATUS from '@enums/submission-status.enum';
import {IPerson} from '@entity/audit.entity';
import SubmissionSubmitRequestDto from '@dto/trx/submission/submission-submit-request.dto';
import SubmissionDetailInterface from '@interface/submission-detail.interface';
import DocumentServiceImpl from '@service/impl/document.service-impl';
import SubmissionApprovalRequestDto from '@dto/trx/submission/submission-approval-request.dto';
import SubmissionProcessRequestDto from '@dto/trx/submission/submission-process-request.dto';
import Topsis, {Criteria} from '@core/topsis';
import {CriteriaScore} from '@core/criteria-score';
import TrxSpkEntity from '@entity/trx/trx-spk.entity';
import {ROLE_ENUM} from '@enums/role.enum';
import TrxSubmissionPeriodEntity from '@entity/trx/trx-submission-period.entity';
import SubmissionEligibleRequestDto from '@dto/trx/submission/submission-eligible-request.dto';
import {Response} from 'express';
import {ACTION_ENUM} from '@enums/action.enum';

@provide(TYPES.SUBMISSION_SERVICE)
export default class SubmissionServiceImpl implements SubmissionService {
    @inject<SqlEntityManager<PostgreSqlDriver>>(TYPES.ENTITY_MANAGER)
    private readonly em: SqlEntityManager<PostgreSqlDriver>;

    @inject<AuthService>(TYPES.AUTH_SERVICE)
    private readonly authService: AuthService;

    @inject<SubmissionPeriodRepository>(TYPES.SUBMISSION_PERIOD_REPOSITORY)
    private readonly submissionPeriodRepository: SubmissionPeriodRepository;

    @inject<DocumentServiceImpl>(TYPES.DOCUMENT_SERVICE)
    private readonly documentService: DocumentServiceImpl;

    private checkAccess(user: IUserPayload, submissionStudentId: number) {
        if (user.user_type != ROLE_ENUM.STUDENT)
            return;
        if (user.additional_info.id != submissionStudentId)
            throw new HttpException(403, 'You don\'t have access to this resource.')
    }

    async getOpenSubmission() {
        const today = now('YYYY-MM-DD');
        const row = await this.submissionPeriodRepository.findOne({
            status: PERIOD_STATUS.OPEN,
            start_date: {
                $lte: today
            },
            end_date: {
                $gte: today
            },
            deleted_at: null,
            deleted_by: null
        })
        if (!row)
            throw new HttpException(400, 'Saat ini tidak ada periode yang terbuka.')
        return row;
    }

    async saveBasicData(dto: SubmissionBasicDataRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity> {
        let entity: TrxSubmissionEntity;
        const person: IPerson = {
            id: user.id,
            name: user.name
        }
        if (dto.id != null) {
            // update
            entity = await this.em.findOne(TrxSubmissionEntity, {
                id: dto.id,
                period_id: dto.period_id,
                student_id: user.additional_info.id,
            })
            if (!entity)
                throw new HttpException(404, 'Submission not found.')
            if (entity.status !== SUBMISSION_STATUS.NEW)
                throw new HttpException(404, `Submission can\'t be updated. (status: ${entity.status})`)
            entity.entry_period = dto.entry_period;
            entity.class = dto.class;
            entity.semester = dto.active_semester;
            entity.updated_by = person;
        } else {
            // insert
            entity = this.em.create(TrxSubmissionEntity, {
                period_id: dto.period_id,
                student_id: user.additional_info.id,
                entry_period: dto.entry_period,
                class: dto.class,
                semester: dto.active_semester,
                created_by: person,
                status: SUBMISSION_STATUS.NEW
            })
        }
        await this.em.persistAndFlush(entity)
        return entity;
    }

    async saveGrade(dto: SubmissionGradeDataRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity> {
        const entity = await this.em.findOne(TrxSubmissionEntity, {
            id: dto.id,
            student_id: user.additional_info.id,
        })
        if (!entity)
            throw new HttpException(404, 'Submission not found.')
        if (entity.status !== SUBMISSION_STATUS.NEW)
            throw new HttpException(404, `Submission can\'t be updated. (status: ${entity.status})`)
        entity.ipk = dto.ipk ?? 0;
        entity.total_sks = dto.sks ?? 0;
        entity.rpl = dto.rpl ?? 0;
        entity.jarkom = dto.jarkom ?? 0;
        entity.sistem_operasi = dto.sistem_operasi ?? 0;
        entity.basis_data = dto.basis_data ?? 0;
        entity.pengembangan_aplikasi_web = dto.basis_data ?? 0;
        entity.achievement = null;
        entity.learning_achievement = dto.learning_achievement;
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async submit(dto: SubmissionSubmitRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity> {
        const entity = await this.em.findOne(TrxSubmissionEntity, {
            id: dto.id,
            student_id: user.additional_info.id,
        })
        if (!entity)
            throw new HttpException(404, 'Submission not found.')
        if (entity.status !== SUBMISSION_STATUS.NEW)
            throw new HttpException(404, `Submission can\'t be updated. (status: ${entity.status})`)
        entity.status = SUBMISSION_STATUS.SUBMITTED;
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async detail(id: number, user: IUserPayload): Promise<SubmissionDetailInterface> {
        const entity = await this.em.findOne(TrxSubmissionEntity, {
            id
        }, {
            populate: ['student']
        })
        if (!entity)
            throw new HttpException(404, 'Submission not found.')
        this.checkAccess(user, entity.student_id)
        if (!entity.student.getEntity())
            throw new HttpException(404, 'Student not found.')
        const documents = await this.documentService.getFiles(entity.period_id, entity.id, entity.student.getEntity().nim)
        return {
            detail: entity,
            documents: documents
        };
    }

    async approval(dto: SubmissionApprovalRequestDto, user: IUserPayload): Promise<TrxSubmissionEntity> {
        const entity = await this.em.findOne(TrxSubmissionEntity, {
            id: dto.submission_id,
            period_id: dto.period_id,
            status: SUBMISSION_STATUS.SUBMITTED
        })

        if (!entity)
            throw new HttpException(404, 'Submission not found.')
        entity.status = dto.status;
        const approvedBy: IPerson & {
            reason?: string;
        } = {
            id: user.id,
            name: user.name,
            reason: dto.status === SUBMISSION_STATUS.REJECTED ? dto.reason : null
        }
        entity.achievement = dto.achievement;
        entity.approved_by = approvedBy;
        entity.approved_at = nowAsTimestamp();
        await this.em.persistAndFlush(entity);
        return entity;
    }

    async processSPK(dto: SubmissionProcessRequestDto, user: IUserPayload): Promise<boolean> {
        const period = await this.em.findOne(TrxSubmissionPeriodEntity, {
            id: dto.period_id,
            status: PERIOD_STATUS.CLOSED
        })
        if (!period)
            throw new HttpException(403, 'Periode saat ini masih dibuka.')
        const criteria: Criteria[] = [
            {name: 'Nilai IPK', score: CriteriaScore.ipk},
            {name: 'Total SKS', score: CriteriaScore.total_sks},
            {name: 'Penilaian Capaian', score: CriteriaScore.achievement},
            {name: 'Nilai Rekayasa Perangkat Lunak', score: CriteriaScore.rpl},
            {name: 'Nilai Jaringan Komputer', score: CriteriaScore.jarkom},
            {name: 'Nilai Sistem Operasi', score: CriteriaScore.sistem_operasi},
            {name: 'Nilai Basis Data', score: CriteriaScore.basis_data},
            {name: 'Nilai Pengembangan Aplikasi berbasis Web', score: CriteriaScore.pengembangan_aplikasi_web},
        ]
        const topsis = new Topsis<{submission_id: number, nim: string}>(criteria);
        const submissionList = await this.em.find(TrxSubmissionEntity, {
            period_id: dto.period_id,
            status: SUBMISSION_STATUS.APPROVED
        }, {
            populate: [
                'student'
            ]
        })
        await this.em.begin();
        try {
            for (const submission of submissionList) {
                topsis.addPerson(
                    submission.student_id,
                    submission.student.getEntity().name,
                    [
                        {name: criteria[0].name, score: submission.ipk},
                        {name: criteria[1].name, score: submission.total_sks},
                        {name: criteria[2].name, score: submission.achievement},
                        {name: criteria[3].name, score: submission.rpl},
                        {name: criteria[4].name, score: submission.jarkom},
                        {name: criteria[5].name, score: submission.sistem_operasi},
                        {name: criteria[6].name, score: submission.basis_data},
                        {name: criteria[7].name, score: submission.pengembangan_aplikasi_web},
                    ],
                    {
                        nim: submission.student.getEntity().nim,
                        submission_id: submission.id
                    }
                )
            }
            const ranks = topsis.getRank();
            await this.em.qb(TrxSpkEntity).delete().where({period_id: dto.period_id})

            const savedEntities: TrxSpkEntity[] = []
            let rankNumber = 1;
            for (const rank of ranks) {
                savedEntities.push({
                    period_id: dto.period_id,
                    submission_id: rank.person.attrs.submission_id,
                    rank: rankNumber,
                    preference_value: rank.preference_value,
                    criteria: JSON.stringify(rank.criteria_values),
                    processed_at: nowAsTimestamp(),
                    processed_by: {
                        id: user.id,
                        name: user.name
                    }
                })
                rankNumber++;
            }
            if (savedEntities.length > 0) {
                await this.em.insertMany(TrxSpkEntity, savedEntities)
            }
            await this.em.commit();
            return true;
        } catch (e) {
            await this.em.rollback();
            throw new HttpException(500, e.message)
        }
    }

    async eligible(dto: SubmissionEligibleRequestDto, user: IUserPayload, file: Express.Multer.File, res: Response): Promise<boolean> {
        const entity = await this.em.findOne(TrxSubmissionEntity, {
            id: dto.submission_id,
            period_id: dto.period_id,
            status: SUBMISSION_STATUS.APPROVED
        }, {
            populate: ['student']
        })
        if (!entity)
            throw new HttpException(404, 'Data submission tidak ditemukan.')
        try {
            if (dto.action === ACTION_ENUM.ELIGIBLE) {
                await this.documentService.uploadRecommendation(dto.period_id, dto.submission_id,file,entity.student.getEntity().nim,user,res);
            }
            entity.status = dto.action === ACTION_ENUM.ELIGIBLE ? SUBMISSION_STATUS.ELIGIBLE : SUBMISSION_STATUS.NOT_ELIGIBLE;
            await this.em.persistAndFlush(entity);
            return true;
        } catch (e) {
            throw e;
        }
    }


}