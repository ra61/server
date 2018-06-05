
const log4js = require('log4js');
const option = require('./log4js.json');
log4js.configure(option);
const logger = log4js.getLogger();
const classify_logger = log4js.getLogger('classify');
const segment_logger = log4js.getLogger('segment');

module.exports = {
    log4js,
    logger,
    classify_logger,
    segment_logger
}