import { controller, httpGet } from 'inversify-express-utils';
import BaseController from '@controller/base.controller';

@controller('/')
export default class HomeController extends BaseController {

  @httpGet('')
  async index() {
    return this.success<string>(null, 'Server is running...');
  }
}
