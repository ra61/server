const ffmpeg = require('fluent-ffmpeg');
const { logger } = require('../../common');
module.exports = function (source_path, save_path) {
    return new Promise((resolve, reject) => {
        ffmpeg(source_path)
            .withAudioBitrate('24k')
            .audioChannels(1)
            .outputOptions([
                "-write_xing 0",
            ])
            .save(save_path)
            .on("error", (err) => {
                reject(false);
                // logger.info(err);
            })
            .on("end", () => {
                resolve(true);
                // logger.info(save_path + ':' + '转换MP3成功');
            })
    });
};