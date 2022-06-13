import {createLogger, format, transports} from 'winston';
import * as fs from 'fs';
import * as path from 'path';

/* const l = new Logger(path.resolve(__dirname, '../../log/logs.log')); */

const logDir = `${__dirname}/../../log`;

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const filename = path.join(logDir, 'logs.log');
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(info => `[${info.timestamp}] [${info.level}] ${info.message}`),
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine(
                format.colorize(),
                format.printf(
                    info => `[${info.timestamp}] [${info.level}] ${info.message}`,
                ),
            ),
        }),

        new transports.File({filename}),
    ],
});
/* const s = new ServiceLogger(l); */

export {logger} ;
