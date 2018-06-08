const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const async = require('async');
const emitter = require('./save');

function classify(batch_id, audio_list) {
    // 有效音频
    let valid_audio = [];
    // 无效音频
    let invalid_audio = [];
    // 无需切分音频
    let other_audio = [];

    // 遍历所有音频
    async.each(audio_list, (audio) => {
        audio.path = audio.path.replace(/\\/g, '/');
        if (audio.invalid === 1) {

            let bass_path = path.dirname(audio.path);
            let sub_file_list = fs.readdirSync(bass_path);

            async.each(sub_file_list, (item) => {
                if (!_.endsWith(item, ".san_convert.mp3")) {
                    let audio_path = path.join(bass_path, item);
                    valid_audio.push({
                        "filename": item,
                        "path": audio_path,
                        "classify": audio.info
                    });
                }
            })

        } else if (audio.invalid === 2) {
            invalid_audio.push(audio.path);
        } else {
            other_audio.push(audio.path);
        }
    })

    emitter.emit('update', batch_id, { valid_audio: valid_audio, invalid_audio: invalid_audio, other_audio: other_audio })

    return {valid_audio: valid_audio,invalid_audio: invalid_audio,other_audio: other_audio}
}

function inspect(batch_id, audio_list) {
    // 数据总量
    let totalSize = 0;

    // 存在的音频
    let exist_audio = [];

    // 不存在的音频
    let not_exist_audio = [];

    // 路径指向不是文件
    let not_audio = [];

    // 遍历所有路径
    async.each(audio_list, (audio) => {
        let audio_path = audio.path;

        audio_path = audio_path.replace(/\\/g, '/');

        if (fs.existsSync(audio_path)) {

            let stat = fs.statSync(audio_path);

            if (stat && stat.isFile()) {
                // 收集存在的文件路径
                exist_audio.push(audio_path);
                // 计算数据总量
                totalSize += stat.size;
            } else {
                // 不是音频
                not_audio.push(audio_path);
            }

        } else {
            // 路径不存在
            not_exist_audio.push(audio_path);
        }
    });

    emitter.emit('update', batch_id, { totalSize: totalSize, exist_audio: exist_audio, not_audio: not_audio, not_exist_audio: not_exist_audio });
    return { totalSize: totalSize, exist_audio: exist_audio, not_audio: not_audio, not_exist_audio: not_exist_audio}
}

module.exports = function (batch_id, query_audio) {
    // 音频分类
    let query_audio_classified = classify(batch_id, query_audio);
    // 有效音频
    let valid_audio = query_audio_classified.valid_audio;
    // 音频校验
    let export_audio_info = inspect(batch_id, valid_audio);

    return export_audio_info;
}