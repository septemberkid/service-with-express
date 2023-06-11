import {injectable} from 'inversify';
import BaseRepository from '@repository/base.repository';
import MstFacultyEntity from '@entity/master/mst-faculty.entity';

@injectable()
export default class FacultyRepository extends BaseRepository<MstFacultyEntity> {
}