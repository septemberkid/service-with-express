import {injectable} from 'inversify';
import BaseRepository from '@repository/base.repository';
import TrxSubmissionEntity from '@entity/trx/trx-submission.entity';

@injectable()
export default class SubmissionRepository extends BaseRepository<TrxSubmissionEntity>{

}