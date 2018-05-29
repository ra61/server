function queryResult(connection, sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, result) {
            if (err) {
                reject(err);
            } else {
                // resolve(JSON.parse(JSON.stringify(result)));
                resolve(result);
                // 归还连接
                connection.release();
            }
        })
    });
}

module.exports = queryResult;