import { existsSync, mkdirSync } from 'fs';
import winston from 'winston';
import winstonDaily, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';
import { toUppercase } from '@util/helpers';
import { LOG_DIR } from '@config';

if (!existsSync(LOG_DIR)) {
  mkdirSync(LOG_DIR);
}
const logFormat = winston.format.printf(
  ({ timestamp, level, message }) =>
    `${timestamp} [${toUppercase(level)}]: ${message}`
);
const winstonDailyOptions: DailyRotateFileTransportOptions = {
  datePattern: 'YYYY-MM-DD',
  filename: '%DATE%.log',
  maxFiles: 30, // 30 Days saved
  handleExceptions: true,
  json: false,
  zippedArchive: true,
};
const Logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    new winstonDaily({
      ...winstonDailyOptions,
      level: 'error',
      dirname: LOG_DIR + '/error',
    }),
  ],
});
if (process.env.NODE_ENV !== 'production') {
  Logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.colorize()
      ),
    })
  );
}
export default Logger;
