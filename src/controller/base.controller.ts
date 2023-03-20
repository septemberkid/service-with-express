import { BaseHttpController } from 'inversify-express-utils';
import ResponseDto, { IPageMeta } from '@dto/response.dto';

export default class BaseController extends BaseHttpController {
  success<T>(result: T, message: string = null, statusCode = 200) {
    return this.json(ResponseDto.success<T>(result, message), statusCode);
  }

  fail(message: string, statusCode = 500) {
    return this.json(ResponseDto.fail(message), statusCode);
  }

  paginated<T>(result: T[], meta: IPageMeta, message: string = null) {
    return this.json(ResponseDto.paginated<T>(result, meta, message), 200);
  }
}
