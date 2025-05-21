import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        // winston.format.label({ label: "Phono" }),
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('Phono', {
          prettyPrint: true,
          colors: true,
        }),
        // winston.format.printf(({ level, message, label, timestamp }) => {
        //   return `${timestamp} [${label}] ${level}: ${message}`;
        // })
      ),
    }),
    new winston.transports.File({
      filename: 'logs/application.log',
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
};
