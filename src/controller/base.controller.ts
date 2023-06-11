import { BaseHttpController } from 'inversify-express-utils';
import ResponseDto from '@dto/response.dto';
import PageMetaInterface from '@interface/page-meta.interface';
import {RequestUserInterface} from '@interface/request-user.interface';
import {Response} from 'express';
import HttpException from '@exception/http.exception';

export default class BaseController extends BaseHttpController {
  success<T>(result: T, message = 'success', statusCode = 200) {
    return this.json(ResponseDto.success<T>(result, message), statusCode);
  }

  fail(message: string, statusCode = 500) {
    return this.json(ResponseDto.fail(message), statusCode);
  }

  paginated<T>(result: T[], meta: PageMetaInterface, message = 'success') {
    return this.json(ResponseDto.paginated<T>(result, meta, message), 200);
  }


  protected validatePathParam(req: RequestUserInterface, res: Response) {
    if (Number.isNaN(parseInt(req.params.id)))
      throw new HttpException(400, res.__('validation.must_be_number', {
        field: 'ID'
      }))
  }
}
