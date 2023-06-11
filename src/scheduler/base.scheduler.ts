import {injectable} from 'inversify';
@injectable()
export default abstract class BaseScheduler {
    abstract runCronJob(): void;
}