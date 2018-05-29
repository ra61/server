
const async = require('async');
const ffmpeg = require('fluent-ffmpeg');
const convertMp3 = require('./convertMp3');
const { logger } = require('../../common');

module.exports = async function (audio_path_list) {

    return new Promise(resolve => {

        async.map(audio_path_list, function (audio_path, callback) {

            ffmpeg.ffprobe(audio_path, async (err, metadata) => {
                if (err) {
                    logger.info(err);
                } else {
                    if (metadata) {
                        // 提取有效信息
                        let format = metadata['format'];
                        // 文件转换
                        let mp3_file_path = audio_path + ".san_convert.mp3";

                        let flag = await convertMp3(audio_path, mp3_file_path);

                        if(flag){
                            callback(null, {path: mp3_file_path, duration: format.duration, size: format.size});
                        } else {
                            logger.info(audio_path + '转换失败');
                        }

                    } else {
                        logger.info(audio_path + '提取文件信息失败');
                    }
                }
            });

        }, function (err, result) {
            resolve(result);
        });
    });



};