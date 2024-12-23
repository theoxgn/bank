const fs = require('fs');
const path = require('path');
const winston = require('winston');

const logName = 'app.log';
const transports = [];

transports.push(new winston.transports.Console());

const logDir = 'logs';
if ( !fs.existsSync(logDir) ) {
    fs.mkdirSync(logDir);
}
const logFile = path.join(logDir, logName);
transports.push(new winston.transports.File({ filename: logFile }));

const logger = new winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        winston.format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}]: ${info.message} `)
    ),
    transports: transports
});

module.exports = logger;