
const config = {
    development: require('./development.json'),
    production: require('./production.json'),
    test: require('./test.json')
};

module.exports = config[process.env.NODE_ENV || 'development'];
