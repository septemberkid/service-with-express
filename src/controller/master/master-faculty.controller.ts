import { inject } from 'inversify';
import { controller, httpGet, requestParam } from 'inversify-express-utils';
import useHeaderMiddleware from '@middleware/header.middleware';
import BaseController from '@controller/base.controller';
import { populateWhere } from '@util/query';
import useRequestMiddleware from '@middleware/request.middleware';
import FacultyPaginatedRequestDto from '@dto/master/faculty/faculty-paginated-request.dto';
import { plainToInstance } from 'class-transformer';
import { requestQuery } from '@util/decorator';
import MasterFacultyEntity from '@entity/master/master-faculty.entity';
import HttpException from '@exception/http.exception';
import PaginationRepository from '@repository/pagination.repository';

@controller('/master/faculty')
export default class MasterFacultyController extends BaseController {
  constructor(
    @inject('MasterFacultyEntityRepository')
    private readonly repo: PaginationRepository<MasterFacultyEntity>
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

  @httpGet('',
    useHeaderMiddleware(),
    useRequestMiddleware(FacultyPaginatedRequestDto, 'query')
  )
  async paginatedList(@requestQuery() query: FacultyPaginatedRequestDto) {
    query = plainToInstance(FacultyPaginatedRequestDto, query);
    const where = populateWhere({
      ilike: {
        name: wrap => wrap(query.name, 'both')
      },
    })
    const { result, meta } = await this.repo.pagination(MasterFacultyEntity, where, query);
    return this.paginated(result, meta);
  }

}