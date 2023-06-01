import {controller, httpGet, httpPost} from 'inversify-express-utils';
import BaseController from '@controller/base.controller';
import {inject} from 'inversify';
import TYPES from '@enums/types.enum';
import {generateUUID, isEmpty} from '@util/helpers';
import {nowAsTimestamp} from '@util/date-time';
import {requestBody} from 'inversify-express-utils/lib/decorators';
import HttpException from '@exception/http.exception';
import Encryptor from '@util/encryptor';
import useRequestMiddleware from '@middleware/request.middleware';
import {plainToInstance} from 'class-transformer';
import {requestQuery} from '@util/decorator';
import ProgramStudyFilter from '@dto/master/program-study/program-study.filter';
import FacultyRepository from '@repository/master/faculty.repository';
import StudyProgramRepository from '@repository/master/study-program.repository';
import FacultyFilter from '@dto/master/faculty/faculty.filter';
import MstFacultyEntity from '@entity/master/mst-faculty.entity';
import MstStudyProgramEntity from '@entity/master/mst-study-program.entity';

@controller('/')
export default class HomeController extends BaseController {
  @inject(TYPES.FACULTY_REPOSITORY)
  private readonly facultyRepository: FacultyRepository
  @inject(TYPES.STUDY_PROGRAM_REPOSITORY)
  private readonly studyProgramRepository: StudyProgramRepository

  @httpGet('')
  async index() {
    return this.success<string>('', 'Server is running...');
  }
  @httpGet('generate-uuid')
  async generateUUID() {
    const uuid = generateUUID(nowAsTimestamp());
    return this.success<string>(uuid);
  }
  @httpPost('generate-md5-password')
  async generateMd5Password(@requestBody() body: {plain_password?: string}) {
    if (isEmpty(body.plain_password))
      throw new HttpException(400, 'Plain password is required')
    const md5Password = Encryptor.md5(body.plain_password);
    return this.success<string>(md5Password);
  }
  @httpPost('generate-password')
  async generatePassword(@requestBody() body: {plain_password?: string}) {
    if (isEmpty(body.plain_password))
      throw new HttpException(400, 'Plain password is required')
    const md5Password = Encryptor.md5(body.plain_password);
    const password = await Encryptor.hashBcrypt(md5Password);
    return this.success<string>(password);
  }
  @httpGet(
    'public/faculty',
    useRequestMiddleware(FacultyFilter, 'query')
  )
  async getFacultyPaginatedList(@requestQuery() query: FacultyFilter) {
    query = plainToInstance(FacultyFilter, query);
    const { result, meta } = await this.facultyRepository.page(
        MstFacultyEntity,
        {
          name: {
            $ilike: query.name
          },
          is_active: {
            $eq: query.is_active,
          },
        },
        query.order,
        {
          offset: query.offset,
          limit: query.limit
        }
    );
    return this.paginated(result, meta);
  }
  @httpGet(
    'public/study-program',
    useRequestMiddleware(ProgramStudyFilter, 'query')
  )
  async getProgramStudyPaginatedList(@requestQuery() query: ProgramStudyFilter) {
    query = plainToInstance(ProgramStudyFilter, query)
    const { result, meta } = await this.studyProgramRepository.page(
        MstStudyProgramEntity,
        {
          name: {
            $ilike: query.name
          },
          is_active: {
            $eq: query.is_active
          },
          faculty_id: {
            $eq: query.faculty_id
          }
        },
        query.order,
        {
          offset: query.offset,
          limit: query.limit
        }
    );
    return this.paginated(result, meta);
  }
}
