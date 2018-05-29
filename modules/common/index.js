
const { log4js, logger} = require('./js/log4js');
module.exports = {
    getConnection: require('./js/connection'),
    queryResult: require('./js/query'),
    mongoose: require('./js/mongoose'),
    log4js: log4js,
    logger: logger
};