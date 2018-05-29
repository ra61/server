const fs = require('fs');

function classify(audio_list) {
    // 有效音频
    let valid_audio = [];
    // 标记为有效视频，但文件不存在
    let not_exist_valid_audio = [];
    // 无效音频
    let invalid_audio = [];
    // 无需切分音频
    let other_audio = [];

    // 遍历所有音频
    for (let i = 0; i < audio_list.length; i++) {
        let audio = audio_list[i];
        audio.path = audio.path.replace(/\\/g, '/');
        if (audio.invalid === 1) {
            if (fs.existsSync(audio.path)) {
                valid_audio.push(audio);
            } else {
                // 反馈不存在的文件
                not_exist_valid_audio.push(audio);
            }

        } else if (audio.invalid === 2) {
            invalid_audio.push(audio.path);
        } else {
            other_audio.push(audio.path);
        }
    }

    return {valid_audio: valid_audio,invalid_audio: invalid_audio,other_audio: other_audio, not_exist_valid_audio: not_exist_valid_audio}
}

module.exports = classify;