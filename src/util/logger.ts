import { existsSync, mkdirSync } from 'fs';
import winston, { format, Logger as WinstonLogger } from 'winston';
import winstonDaily, { DailyRotateFileTransportOptions } from 'winston-daily-rotate-file';
import { ProvideSingleton } from '@util/decorator';
import TYPES from '@enums/types.enum';
import { resolve } from 'path';
import { FileTransportOptions } from 'winston/lib/winston/transports';
import { toUppercase } from '@util/helpers';
import { Configuration } from '@core/config';

interface WinstonLoggerOptions {
  file: FileTransportOptions;
}
// Log Types
type LOG_TYPE = {
  'info': 'info';
  'error': 'error';
}

// default configs
const config = Configuration.instance();
const LOG_DIR = config.get('LOG_DIR')
const NODE_ENV = config.get('NODE_ENV')
const rootDir: string = resolve(__dirname, '../../');
const logsDirectory = `${rootDir}/${LOG_DIR||'logs'}`
const maxsize = 5242880;

// check to see if logsDirectory folder exists
if (!existsSync(logsDirectory)) {
  mkdirSync(logsDirectory);
}

// Transform the output into more readable string
const logFormat = winston.format.printf(
  (info) => {
    const { timestamp, level, message } = info;
    return `${timestamp} [${toUppercase(level)}]: ${message}`
  }
);
const winstonDailyOptions: DailyRotateFileTransportOptions = {
  datePattern: 'YYYY-MM-DD',
  filename: 'service-%DATE%.log',
  maxFiles: 30, // 30 Days saved
  maxSize: '20m',
  handleExceptions: false,
  json: false,
  zippedArchive: true,
};
@ProvideSingleton(TYPES.LOGGER)
export class Logger {
  public logger: WinstonLogger;
  private readonly options: WinstonLoggerOptions;

  constructor() {
    this.options = {
      file: {
        maxsize
      },
    }
    this.logger = winston.createLogger({
      format: format.combine(
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        logFormat
      ),
      transports: [
        new winstonDaily({
          ...winstonDailyOptions,
          dirname: `${logsDirectory}`,
        }),
      ]
    });
    
    if (NODE_ENV !== 'production') {
      this.logger.add(
        new winston.transports.Console({
          format: format.combine(
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            logFormat
          )
        })
      )
    }
  }

  public log(error: Error, type: keyof LOG_TYPE): void {
    this.logger.log(type, error.message)
  }
  public logMessage(message: string, type: keyof LOG_TYPE): void {
    this.logger.log(type, message)
  }
}