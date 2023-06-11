import SubmissionPeriodRepository from '@repository/trx/submission-period.repository';
import {scheduleJob} from 'node-schedule';
import BaseScheduler from '@scheduler/base.scheduler';
import {inject, injectable} from 'inversify';
import TYPES from '@enums/types.enum';
import {Logger} from '@util/logger';

@injectable()
export default class ClosePeriodScheduler extends BaseScheduler {
    @inject(TYPES.SUBMISSION_PERIOD_REPOSITORY) public repo: SubmissionPeriodRepository
    @inject(TYPES.LOGGER) public logger: Logger

    runCronJob() {
        // run every day in 00:05
        scheduleJob('* 5 0 * * *', () => this.autoClosePeriod())
    }

    private async autoClosePeriod() {
        try {
            await this.repo.autoSubmitAndClose();
        } catch (e) {
            this.logger.logMessage(`AUTO SUBMIT AND CLOSE PERIOD SCHEDULER: ${e.message}`, 'error')
        }
    }

}