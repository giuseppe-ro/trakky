import { createLogger, format, transports } from 'winston';
const { combine, splat, timestamp, printf } = format;


const logFormat = printf( ({ level, message, timestamp}: any) => {
  let msg = `[${timestamp}] - [${level}] : ${message} `  
  return msg
});

export const logger = createLogger({
  level: 'info',
  format: combine(
    format.colorize({ all: true }),
    splat(),
    timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    logFormat
  ),
  transports: [
	new transports.Console({ level: 'info' }),
	// new transports.File({ filename: config.get("app.logging.outputfile"), level: 'debug' }),
  ]
});