import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import useHeaderMiddleware from '@middleware/header.middleware';
import BaseController from '@controller/base.controller';
import { populateWhere } from '@util/query';
import ProgramStudyMasterRepository from '@repository/master/program-study-master.repository';
import FacultyMasterRepository from '@repository/master/faculty-master.repository';
import { isEmpty } from 'class-validator';
import useRequestMiddleware from '@middleware/request.middleware';
import { requestQuery } from '@util/decorator';
import ProgramStudyPaginatedRequestDto from '@dto/master/program-study/program-study-paginated-request.dto';
import { plainToInstance } from 'class-transformer';

@controller('/master/program-study')
export default class ProgramStudyMasterController extends BaseController {
  @inject<ProgramStudyMasterRepository>('ProgramStudyMasterRepository')
  private _repository: ProgramStudyMasterRepository;

  @inject<FacultyMasterRepository>('FacultyMasterRepository')
  private _facultyRepository: FacultyMasterRepository;

  @httpGet(
    '/:xid',
    useHeaderMiddleware(),
  )
  async retrieve(@requestParam('xid') xid: string) {
    const result = await this._repository.retrieve<string>(xid);
    return this.success(result.toJSON(true));
  }

  @httpGet(
    '',
    useHeaderMiddleware(),
    useRequestMiddleware(ProgramStudyPaginatedRequestDto, 'query')
  )
  async paginatedList(@requestQuery() query: ProgramStudyPaginatedRequestDto) {
    query = plainToInstance(ProgramStudyPaginatedRequestDto, query);
    let where = {};
    // find faculty based on faculty_xid
    if (!isEmpty(query.faculty_xid)) {
      const faculty = await this._facultyRepository.retrieve(query.faculty_xid);
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

    const { result, meta } = await this._repository.pagination(where, query);
    return this.paginated(result, meta);
  }

}