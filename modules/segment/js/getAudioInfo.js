

const segment = require('./segment');
const inspect = require('./inspect');
const update = require('../db/update');

module.exports = async function (batch_id, valid_audio) {
    
    // 音频切割
    let export_audio_list = await segment(valid_audio);
    // 音频校验
    let export_audio_info = inspect(export_audio_list);
    // 保存切音文件路径
    await update(batch_id, export_audio_info);

    return export_audio_info;
};