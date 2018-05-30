
const async = require('async');
const { getConnection, queryResult } = require('../../common');
const { logger } = require('./log4js');
const segmentPool = require('../../segment/js/pool');

function save(connection, batch_id, audio_list) {
    return new Promise(resolve => {
        async.map(audio_list, function (audio, callback) {
            let save_path = audio.path.replace(/\\/g, "/");

            connection.beginTransaction(function(err) {
                if (err) { throw err; }
                connection.query('insert into project_source set batch_id=?, path=?,duration=?,size=?',
                    [batch_id, save_path, audio.duration, audio.size],
                    (error) => {
                        if (error) {
                            return connection.rollback(function() {
                                logger.error(error);
                            });
                        }

                        connection.commit(function(err) {
                            if (err) {
                                return connection.rollback(function() {
                                    logger.error(err);
                                });
                            }
                            callback(null, save_path);
                        });
                });
            });

        }, function (err, result) {
            if(err){
                logger.error(err);
            } else {
                resolve(result);
            }
        });
    });

};


module.exports = async function (batch_id, info) {
    // 获取任务连接
    let delete_connection = await getConnection(segmentPool);

    let delete_sql = `delete from project_source where batch_id = ${batch_id}`;
    // 删除
    await queryResult(delete_connection, delete_sql);

    let connection = await getConnection(segmentPool);

    let save_result = await save(connection, batch_id, info);

    // console.log(save_result);

    let query_sql = `select * from project_source where batch_id = ${batch_id}`;
    // 查询
    let query_audio = await queryResult(connection, query_sql);

    console.log(query_audio);
}