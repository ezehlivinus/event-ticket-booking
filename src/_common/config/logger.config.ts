import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

const configService = new ConfigService();

const isInProduction = configService.get('app.isInProduction');
const isInDevelopment = !isInProduction;
const winstonOptions: winston.LoggerOptions = {
  level: 'info',
  
  
  transports: [
    ...(isInDevelopment ? [new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })] : []),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
      maxsize: 5 * 1024 * 1024 // 5mb
    })
  ]
}

export const logger = winston.createLogger(winstonOptions);