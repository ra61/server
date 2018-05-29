const fs = require('fs');

function inspect(audio_list) {
    // 数据总量
    let totalSize = 0;

    // 存在的切音文件
    let exist_audio = [];

    // 不存在的切音文件
    let not_exist_audio = [];

    // 遍历所有路径
    for (let i = 0; i < audio_list.length; i++) {
        let audio_path = audio_list[i];

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

module.exports = inspect;