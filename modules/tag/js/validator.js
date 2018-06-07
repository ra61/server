const _ = require('lodash');
const pool = require('./pool');
const { getConnection, queryResult } = require('../../common');

const validator = async (req, res, next) => {

    let subproject_id = +req.params.subproject_id;
    let batch_id = +req.params.batch_id;

    if(_.isInteger(subproject_id) && subproject_id >= 0 && _.isInteger(batch_id) && batch_id >= 0){

        // try{

        //     let sql = `select * from project_batch where batch_id = ${batch_id}`;
        //     let connection = await getConnection(pool);
        //     let result = await queryResult(connection, sql);

        //     if (_.has(result[0], 'batch_id') && result[0]['batch_id'] === batch_id) {
                next();
        //     } else {
        //         let err = new Error('查询批次ID不存在');
        //         next(err);
        //     }

        // }catch (e) {
        //     next(e.stack);
        // }

    } else {
        let err = new Error('子项目ID或批次ID必须为非负整数');
        next(err);
    }
};

module.exports = validator;