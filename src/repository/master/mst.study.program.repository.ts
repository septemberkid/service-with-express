import PaginationRepository from '@repository/pagination.repository';
import MasterStudyProgramEntity from '@entity/master/master-study-program.entity';
import {injectable} from 'inversify';

@injectable()
export default class MstStudyProgramRepository extends PaginationRepository<MasterStudyProgramEntity> {
    
}