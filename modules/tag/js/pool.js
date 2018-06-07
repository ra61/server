const mysql = require('mysql');

const source = {
    connectionLimit: 10,
    host: "10.0.1.209",
    user: "root",
    password: "txboss",
    database: 'proofreader_audio'
};

// 创建连接池
const pool = mysql.createPool(source);

module.exports = pool;

