import { inject } from 'inversify';
import FacultyMasterRepository from '@repository/master/faculty-master.repository';
import { controller, httpGet, queryParam, requestParam } from 'inversify-express-utils';
import useHeaderMiddleware from '@middleware/header.middleware';
import BaseController from '@controller/base.controller';
import { populateWhere } from '@util/query';

@controller('/master/faculty')
export default class FacultyMasterController extends BaseController {
  @inject<FacultyMasterRepository>('FacultyMasterRepository')
  private _repository: FacultyMasterRepository;

  @httpGet(
    '/:xid',
    useHeaderMiddleware(),
  )
  async retrieve(@requestParam('xid') xid: string) {
    const result = await this._repository.retrieve<string>(xid);
    return this.success(result.toJSON(true));
  }

  @httpGet('', useHeaderMiddleware())
  async paginatedList(
    @queryParam('limit') limit = 10,
    @queryParam('offset') offset = 0,
    @queryParam('name') name: string = null,
    @queryParam('order') order: string = null,
  ) {
    const where = populateWhere({
      ilike: {
        name: wrap => wrap(name, 'both')
      },
    })
    const { result, meta } = await this._repository.pagination(where, order, limit, offset);
    return this.paginated(result, meta);
  }

}