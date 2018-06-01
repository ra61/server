
const express = require('express');
const app = express();

const { log4js, logger } = require('./log4js');

// 响应请求日志
app.use(log4js.connectLogger(log4js.getLogger("normal"), { level: 'auto' }));

// 静态资源  '/static'为虚拟前缀
app.use('/static', express.static('public'));

// 默认首页 非跨域访问
app.get('/', function(req, res, next){
    // const err = new Error('i am an error');
    // next(err);
    res.sendFile(__dirname + '/public/index.html');
});

// 跨域访问
app.use(function (req,res,next) {
    
    if(req.headers.origin === 'http://segment.net:8000' || req.headers.origin === 'http://classify.net'){
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        res.header("Access-Control-Allow-Credentials","true");
        next();
    } else {
        logger.info('不允许的跨域访问');
    }
    
});

// 切音
const segment = require('./modules/segment');

// 自动切音导出
app.get('/segment/:batch_id', segment.validator, segment.main);

// 查询导出进度
app.get('/segment/rate/:batch_id', segment.rate);

// 挑音
const classify = require('./modules/classify');

app.get('/classify/:batch_id', classify.validator, classify.main);

app.get('/classify/rate/:batch_id', classify.rate);

// 错误处理中间件
app.use(function(err, req, res, next) {
    logger.error(err);
});

module.exports = app;