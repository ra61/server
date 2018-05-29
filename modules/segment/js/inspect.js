const fs = require('fs');

module.exports = function (audio_list) {
    // 数据总量
    let totalSize = 0;

    // 存在的切音文件
    let exist_audio = [];

    // 不存在的路径
    let not_exist_path = [];

    // 不存在的切音文件
    let not_audio = [];

    // 遍历所有路径
    for (let i = 0; i < audio_list.length; i++) {
        let audio_path = audio_list[i];

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
            not_exist_path.push(audio_path);
        }

    }

    return {totalSize: totalSize, exist_audio: exist_audio, not_exist_path: not_exist_path, not_audio: not_audio}
}
