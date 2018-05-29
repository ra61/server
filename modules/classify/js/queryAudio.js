const { getConnection, queryResult, logger} = require('../../common');
const pool = require('./pool');
const combination = require('./combination');

module.exports = async function(batch_id){

    // 获取任务连接
    let batch_connection = await getConnection(pool);
    // 根据任务ID查询
    let batch_sql = `select * from project_batch where batch_id = ${batch_id}`;
    // 任务信息
    let batch_info = await queryResult(batch_connection, batch_sql);
    // 项目ID
    let project_id = batch_info[0]['project_id'];
    // 获取项目连接
    let project_connection = await getConnection(pool);
    // 根据项目ID查询
    let project_sql = `select * from project where project_id = ${project_id}`;
    // 项目信息
    let project_info = await queryResult(project_connection, project_sql);
    // 项目分类
    let classify_option = JSON.parse(project_info[0]['classify_options']);
    // 转化形式
    let classify_array = [];
    for (let key in classify_option) {
        if(classify_option.hasOwnProperty(key)){
            classify_array.push(classify_option[key]);
        }
    }
    let classify_in = combination(classify_array).join(`","`);
    // 语句
    let classify_sql = `select wi.*,ps.path from project_source ps join task t on t.task_id = ps.task_id and t.batch_id = ps.batch_id
        join work_info wi on wi.task_id=ps.task_id and wi.source_id=ps.source_id
        where t.batch_id = ${batch_id} and t.task_state = 5 and wi.info in ("${classify_in}")`;
    // 连接
    let classify_connection = await getConnection(pool);
    // 查询
    let query_audio = await queryResult(classify_connection, classify_sql);

    return query_audio;

}

