
const  getValidAudio = require('./getValidAudio');
const  getAudioInfo = require('./getAudioInfo');
const  audioExporting = require('./audioExporting');
const  update = require('../db/update');

module.exports = async function(req, res, next) {

    // 批量任务ID
    let batch_id = req.params.batch_id;
    // 获取合法音频
    let valid_audio = await getValidAudio(batch_id);

    if(valid_audio.length === 0){
        let err = new Error('不存在有效音频需要切割');
        next(err);
    };

    // 获取导出音频的信息
    let audio_info = await getAudioInfo(valid_audio);

    // 保存切音文件路径
    await update(batch_id, audio_info);

    // 导出总量
    let totalSize = audio_info.totalSize;
    // 存在音频
    let exist_audio = audio_info.exist_audio;

    if(exist_audio.length === 0 || totalSize === 0){
        let err = new Error('不存在需要导出的音频');
        next(err);
    }
    
    // 导出路径
    let export_path = 'E:/corpus/segment/';
    // 导出音频
    audioExporting(exist_audio, totalSize, export_path, function (err, exported_info) {

        if(err){
            next(err);
        }

        // 更新导出进度到数据库
        update(batch_id, exported_info);

    });

};