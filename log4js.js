
const log4js = require('log4js');

log4js.configure({
    appenders: {
        console: { type: 'stdout' },
        normal: {
            type: 'file',
            filename: './logs/app/normal/file.log',
            maxLogSize : 102400,
            backups: 20,
            encoding: 'utf-8'
        },
        dateFile: {
            type: 'dateFile',
            filename: './logs/app/dateFile/',
            pattern: "yyyyMMddhh.txt",
            alwaysIncludePattern: true,
        }
    },
    categories: {
        default: { appenders: [ 'console', 'normal', 'dateFile'], level: 'trace' }
    }
});


const logger = log4js.getLogger('dateFile');

module.exports = {
    log4js: log4js,
    logger: logger
};