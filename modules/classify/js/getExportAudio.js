const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function classify(audio_list) {
    // 有效音频
    let valid_audio = [];
    // 无效音频
    let invalid_audio = [];
    // 无需切分音频
    let other_audio = [];

    // 遍历所有音频
    for (let i = 0; i < audio_list.length; i++) {
        let audio = audio_list[i];
        audio.path = audio.path.replace(/\\/g, '/');
        if (audio.invalid === 1) {

            let bass_path = path.dirname(audio.path);
            let sub_file_list = fs.readdirSync(bass_path);

            for (let j = 0; j < sub_file_list.length; j++) {
                // .san_convert.mp3
                let item = sub_file_list[j];
                if (!_.endsWith(item, ".san_convert.mp3")) {
                    let audio_path = path.join(bass_path, item);
                    valid_audio.push({
                        "filename": item,
                        "path": audio_path,
                        "classify": audio.info
                    });
                }
            }

        } else if (audio.invalid === 2) {
            invalid_audio.push(audio.path);
        } else {
            other_audio.push(audio.path);
        }
    }

    return {valid_audio: valid_audio,invalid_audio: invalid_audio,other_audio: other_audio}
}

function inspect(audio_list) {
    // 数据总量
    let totalSize = 0;

    // 存在的音频
    let exist_audio = [];

    // 不存在的音频
    let not_exist_audio = [];

    // 遍历所有路径
    for (let i = 0; i < audio_list.length; i++) {
        let audio_path = audio_list[i].path;

        audio_path = audio_path.replace(/\\/g, '/');

        if (fs.existsSync(audio_path)) {

            // 收集存在的文件路径
            exist_audio.push(audio_path);

            let stat = fs.statSync(audio_path);

            if (stat && stat.isFile()) {

                // 计算数据总量
                totalSize += stat.size;
            }

        } else {

            // 反馈不存在的文件
            not_exist_audio.push(audio_path);
        }

    }

    return {totalSize: totalSize, exist_audio: exist_audio, not_exist_audio: not_exist_audio}
}

module.exports = function (query_audio) {
    // 音频分类
    let query_audio_classified = classify(query_audio);
    // 有效音频
    let valid_audio = query_audio_classified.valid_audio;
    // 音频校验
    let export_audio_info = inspect(valid_audio);

    return export_audio_info;
}