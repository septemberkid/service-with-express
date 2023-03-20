import { BaseHttpController } from 'inversify-express-utils';
import ResponseDto from '@dto/response.dto';

export default class BaseController extends BaseHttpController {
  success<T>(result: T, statusCode = 200) {
    return this.json(ResponseDto.success<T>(result), statusCode);
  }
}
