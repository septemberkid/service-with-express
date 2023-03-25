import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import useHeaderMiddleware from '@middleware/header.middleware';
import BaseController from '@controller/base.controller';
import { populateWhere } from '@util/query';
import { isEmpty } from 'class-validator';
import useRequestMiddleware from '@middleware/request.middleware';
import { requestQuery } from '@util/decorator';
import ProgramStudyPaginatedRequestDto from '@dto/master/program-study/program-study-paginated-request.dto';
import { plainToInstance } from 'class-transformer';
import MasterProgramStudyEntity from '@entity/master/master-program-study.entity';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import PaginationRepository from '@repository/pagination.repository';
import HttpException from '@exception/http.exception';

@controller('/master/program-study')
export default class MasterProgramStudyController extends BaseController {
  constructor(
    @inject('MasterProgramStudyEntityRepository')
    private readonly repo: PaginationRepository<MasterProgramStudyEntity>,
    @inject('MasterFacultyEntityRepository')
    private readonly facultyRepo: PaginationRepository<MasterFacultyEntity>
  ) {
    super();
  }

  @httpGet(
    '/:xid',
    useHeaderMiddleware(),
  )
  async retrieve(@requestParam('xid') xid: string) {
    const result = await this.repo.findOne<string>({
      xid
    });
    if (!result) throw new HttpException(404, 'Data not found')
    return this.success(result);
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
      const faculty = await this.facultyRepo.findOne({
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

    const { result, meta } = await this.repo.pagination(MasterProgramStudyEntity, where, query);
    return this.paginated(result, meta);
  }

}