import { controller, httpGet, httpPost } from 'inversify-express-utils';
import BaseController from '@controller/base.controller';
import { inject } from 'inversify';
import TYPES from '@enums/types.enum';
import MinioService from '@service/minio/minio.service';
import { generateUUID, isEmpty } from '@util/helpers';
import { nowAsTimestamp } from '@util/date-time';
import { requestBody } from 'inversify-express-utils/lib/decorators';
import HttpException from '@exception/http.exception';
import Encryptor from '@util/encryptor';
import useRequestMiddleware from '@middleware/request.middleware';
import FacultyPaginatedRequestDto from '@dto/master/faculty/faculty-paginated-request.dto';
import { plainToInstance } from 'class-transformer';
import { populateWhere } from '@util/query';
import { requestQuery } from '@util/decorator';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import ProgramStudyPaginatedRequestDto from '@dto/master/program-study/program-study-paginated-request.dto';
import MasterStudyProgramEntity from '@entity/master/master-study-program.entity';
import MstFacultyRepository from '@repository/master/mst.faculty.repository';
import MstStudyProgramRepository from '@repository/master/mst.study.program.repository';

@controller('/')
export default class HomeController extends BaseController {
  @inject<MinioService>(TYPES.MINIO_SERVICE)
  private _minioService: MinioService;

  @inject(TYPES.MST_FACULTY_REPOSITORY)
  private readonly mstFacultyRepo: MstFacultyRepository
  @inject(TYPES.MST_STUDY_PROGRAM_REPOSITORY)
  private readonly mstProgramStudyRepo: MstStudyProgramRepository

  @httpGet('')
  async index() {
    return this.success<string>(null, 'Server is running...');
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
    useRequestMiddleware(FacultyPaginatedRequestDto, 'query')
  )
  async getFacultyPaginatedList(@requestQuery() query: FacultyPaginatedRequestDto) {
    query = plainToInstance(FacultyPaginatedRequestDto, query);
    const where = populateWhere({
      ilike: {
        name: wrap => wrap(query.name, 'both')
      },
    })
    console.log(this.mstFacultyRepo)
    const { result, meta } = await this.mstFacultyRepo.pagination(MasterFacultyEntity, where, query);
    return this.paginated(result, meta);
  }
  @httpGet(
    'public/study-program',
    useRequestMiddleware(ProgramStudyPaginatedRequestDto, 'query')
  )
  async getProgramStudyPaginatedList(@requestQuery() query: ProgramStudyPaginatedRequestDto) {
    query = plainToInstance(ProgramStudyPaginatedRequestDto, query);
    let where = {};
    // find faculty based on faculty_xid
    if (!isEmpty(query.faculty_xid)) {
      const faculty = await this.mstFacultyRepo.findOne({
        xid: query.faculty_xid
      });
      if (faculty) {
        where['eq'] = {
          faculty_id: faculty.id
        }
      }
    }
    where = populateWhere({
      ...where,
      ilike: {
        name: wrapper => wrapper(query.name, 'both')
      }
    })

    const { result, meta } = await this.mstProgramStudyRepo.pagination(MasterStudyProgramEntity, where, query);
    return this.paginated(result, meta);
  }
}
