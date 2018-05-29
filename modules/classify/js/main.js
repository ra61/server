
const { getConnection, queryResult, logger} = require('../../common');
const pool = require('./pool');
const queryAudio = require('./queryAudio');
const getExportAudio = require('./getExportAudio');
const exporting = require('./exporting');
const getAudioInfo = require('./getAudioInfo');
const saveToSegment = require('./saveToSegment');

module.exports = async function  (req, res) {
    // 批量任务ID
    let batch_id = req.params.batch_id;
    // 根据ID查询音频信息
    let query_audio = await queryAudio(batch_id);
    // 筛选需要导出的音频信息
    let export_audio_info = getExportAudio(query_audio);

    // 导出总量
    let export_totalSize = export_audio_info.totalSize;
    // 存在音频
    let export_exist_audio = export_audio_info.exist_audio;

    if(export_exist_audio.length === 0 || export_totalSize === 0){
        logger.info('不存在需要导出的音频');
        return;
    }

    // 导出音频
    exporting(export_exist_audio, export_totalSize, function (exported_info) {
        // 保存进度信息到数据库
        // console.log(exported_info);
    });

    // 保存的批次Id
    let save_batch_id = 100;
    // 保存的音频信息
    let save_audio_info = await getAudioInfo(export_exist_audio);
    // 保存到切音平台数据库
    await saveToSegment( save_batch_id, save_audio_info);

};