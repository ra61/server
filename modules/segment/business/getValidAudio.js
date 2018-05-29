const fs = require('fs');
const pool = require('./pool');
const classify = require('./classify');
const { getConnection, queryResult } = require('../../common');
const  update = require('../db/update');


module.exports = async function (batch_id) {
    
    // 查询语句
    let sql = `select si.*,ps.path from project_source ps join task t on t.task_id = ps.task_id and t.batch_id = ps.batch_id join seg_info si on si.task_id=ps.task_id and si.source_id=ps.source_id where t.batch_id = ${batch_id} and t.task_state = 5`;

    // 获取连接
    let connection = await getConnection(pool);
    // 查询结果
    let audio_list = await queryResult(connection, sql);
    // 音频分类
    let audio_list_classified = classify(audio_list);
    // 保存到数据库
    update(batch_id, audio_list_classified);
    // 有效音频
    let valid_audio = audio_list_classified.valid_audio;

    return valid_audio;
};