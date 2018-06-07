
const pool = require('./pool');
const { getConnection, queryResult } = require('../../common');
const  reconsitution = require('./reconsitution');

module.exports = async function (batch_id) {
    
    // 查询语句
    let sql = `select s.source_id,subproject_id,path,info,invalid from source s  join work_info wi on s.source_id=wi.source_id  and s.task_id=wi.task_id
    where batch_id = ${batch_id} `;

    // 获取连接
    let connection = await getConnection(pool);
    // 查询结果
    let query_result = await queryResult(connection, sql);
    // 重构数据
    let seg_info_list = await reconsitution(query_result);

    return seg_info_list;
};