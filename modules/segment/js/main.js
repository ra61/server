
const  segmentAudioModel = require('./model');
const  pool = require('./pool');
const  classify = require('./classify');
const  execute = require('./execute');
const  exporting = require('./exporting');
const  inspect = require('./inspect');
const { getConnection, queryResult } = require('../../common');

module.exports = async function(req, res) {

    // 批量任务ID
    let batch_id = req.params.batch_id;

    // 查询语句
    let sql = `select si.*,ps.path from project_source ps join task t on t.task_id = ps.task_id and t.batch_id = ps.batch_id join seg_info si on si.task_id=ps.task_id and si.source_id=ps.source_id where t.batch_id = ${batch_id} and t.task_state = 5`;

    // 获取连接
    let connection = await getConnection(pool);
    // 查询结果
    let audio_list = await queryResult(connection, sql);
    // 音频分类
    let audio_list_classified = classify(audio_list);

    // 保存批量任务音频分类信息
    segmentAudioModel.findOneAndUpdate(
        {batch_id:batch_id},
        // {valid_audio: valid_audio,invalid_audio: invalid_audio,other_audio: other_audio, not_exist_valid_audio: not_exist_valid_audio}
        audio_list_classified,
        {upsert: true}, function(err, data){
            if (err) {
                logger.error(err);
            }
        });

    // 有效音频
    let valid_audio = audio_list_classified.valid_audio;

    if(valid_audio.length === 0){
        logger.info('不存在有效音频需要切割');
        return;
    }

    // 音频切割
    let export_audio_list = await execute(valid_audio);
    // 音频校验
    let export_audio_info = inspect(export_audio_list);

    // 保存切音文件路径
    segmentAudioModel.findOneAndUpdate(
        {batch_id:batch_id},
        // {totalSize: totalSize, exist_audio: exist_audio, not_exist_audio: not_exist_audio}
        export_audio_info,
        {upsert: true}, function(err, data){
            if (err) {
                logger.error(err);
            }
        });

    // 导出总量
    let totalSize = export_audio_info.totalSize;
    // 存在音频
    let export_exist_audio = export_audio_info.exist_audio;

    if(export_exist_audio.length === 0 || totalSize === 0){
        logger.info('不存在需要导出的音频');
        return;
    }

    // 导出音频
    exporting(export_exist_audio, totalSize, function (exported_info) {

        // 更新导出进度到数据库
        segmentAudioModel.findOneAndUpdate(
            {batch_id:batch_id},
            // {exported_rate: rate, exported_counter: counter, total_audio: total}
            exported_info,
            {upsert: true},
            function(err, data){
                if (err) {
                    logger.error(err);
                }
            });
    });

};