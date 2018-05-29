

const segment = require('./segment');
const inspect = require('./inspect');

module.exports = async function (valid_audio) {
    // 音频切割
    let export_audio_list = await segment(valid_audio);
    // 音频校验
    let export_audio_info = inspect(export_audio_list);

    return export_audio_info;
};