import PaginationRepository from '@repository/pagination.repository';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import {injectable} from 'inversify';

@injectable()
export default class MstFacultyRepository extends PaginationRepository<MasterFacultyEntity> {
    
}