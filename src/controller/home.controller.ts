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

@controller('/')
export default class HomeController extends BaseController {
  @inject<MinioService>(TYPES.MINIO_SERVICE)
  private _minioService: MinioService;

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
    console.log(body.plain_password)
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
}
