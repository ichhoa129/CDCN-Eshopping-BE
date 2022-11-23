import { LoggerOptions } from 'typeorm';
import { LocalLogger } from '@core/loggers/env/local';
import { ProductionLogger } from '@core/loggers/env/production';
import { SYSTEM_ID } from '@config/env';
import { SYSID } from '@core/constants/system';

const loggerMap = {
  [SYSID.LOCALHOST]: LocalLogger,
  [SYSID.PRODUCTION]: ProductionLogger,
};

let loggerInstance: LocalLogger | ProductionLogger;

export class LoggerFactory {
  static getInstance(
    loggerOptions: LoggerOptions,
  ): LocalLogger | ProductionLogger {
    if (!loggerInstance) {
      loggerInstance = new loggerMap[SYSTEM_ID](loggerOptions);
    }
    return loggerInstance;
  }
}
