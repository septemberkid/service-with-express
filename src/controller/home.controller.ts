import {
  BaseHttpController,
  controller,
  httpGet,
} from 'inversify-express-utils';
import AppUserRepository from '@repository/app-user.repository';
import { inject } from 'inversify';

@controller('/')
export default class HomeController extends BaseHttpController {
  @inject('AppUserRepository')
  private readonly _appUserRepository: AppUserRepository;

  @httpGet('')
  async index() {
    const currentUser = await this._appUserRepository.getCurrentUser();
    return this.json(
      {
        data: currentUser,
      },
      200
    );
  }
}
