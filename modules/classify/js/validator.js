const _ = require('lodash');
const { getConnection, queryResult, logger} = require('../../common');
const pool = require('./pool');

const validator = async (req, res, next) => {


    let batch_id = +req.params.batch_id;

    if(_.isInteger(batch_id)&& batch_id >= 1){

        try{

            let connection = await getConnection(pool);
            let sql = `select * from project_batch where batch_id = ${batch_id}`;
            let result = await queryResult(connection, sql);

            if (_.has(result[0], 'batch_id') && result[0]['batch_id'] === batch_id) {

                let project_id = result[0]['project_id'];

                // 校验项目ID
                if(_.isInteger(project_id)&& project_id >= 1){

                    try{

                        let connection = await getConnection(pool);
                        let sql = `select * from project where project_id = ${project_id}`;
                        let result = await queryResult(connection, sql);

                        if (_.has(result[0], 'project_id') && result[0]['project_id'] === project_id) {
                            await next();
                        } else {
                            logger.error('查询项目ID不存在');
                        }

                    }catch (e) {
                        logger.error(e.stack);
                    }

                } else {
                    logger.error('项目ID必须为正整数');
                }


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