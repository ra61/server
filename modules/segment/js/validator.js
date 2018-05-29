const _ = require('lodash');
const { getConnection, queryResult, logger} = require('../../common');

const pool = require('./pool');

const validator = async (req, res, next) => {

    let batch_id = +req.params.batch_id;

    if(_.isInteger(batch_id)&& batch_id >= 1){

        try{

            let sql = `select * from project_batch where batch_id = ${batch_id}`;
            let connection = await getConnection(pool);
            let result = await queryResult(connection, sql);

            if (_.has(result[0], 'batch_id') && result[0]['batch_id'] === batch_id) {
                await next();
            } else {
                logger.error('查询批次ID不存在');
            }

        }catch (e) {
            logger.error(e.stack);
        }

    } else {
        logger.error('批次ID必须为正整数');
    }
};

module.exports = validator;