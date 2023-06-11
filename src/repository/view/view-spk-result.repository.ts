import {injectable} from 'inversify';
import BaseRepository from '@repository/base.repository';
import ViewSpkResultEntity from '@entity/view/view-spk-result.entity';

@injectable()
export default class ViewSpkResultRepository extends BaseRepository<ViewSpkResultEntity>{
}