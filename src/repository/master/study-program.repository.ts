import {injectable} from 'inversify';
import BaseRepository from '@repository/base.repository';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';

@injectable()
export default class StudyProgramRepository extends BaseRepository<MstStudyProgramEntity> {
}