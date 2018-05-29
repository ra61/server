
const app = require('./app.js');
const { logger } = require('./modules/common');

// 设定监听端口
app.set('port', process.env.PORT || 3000);
// 创建服务
const server = require('http').Server(app);
// 监听端口
server.listen(app.get('port'), function(){
    logger.info('Express server listening on port: ' + server.address().port);
});
