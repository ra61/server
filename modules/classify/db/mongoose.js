// 导入mongoose模块
const mongoose = require('mongoose');

// 连接mongoDB数据库
mongoose.connect("mongodb://localhost/classify");

// 挂起连接
const  db = mongoose.connection;

// 连接失败
db.on('error', console.error.bind(console, 'connection error:'));

// 连接成功
db.once('open', function () {
    console.log("Connected correctly to database of classify");
});

module.exports = mongoose;