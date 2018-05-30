const async = require('async');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const { logger } = require('./log4js');

module.exports = function (valid_audio) {

    return new Promise(resolve => {
        async.map(valid_audio, function (item, valid_audio_callback) {
            let source_path = item.path.replace(/\.san_convert\.mp3/, "");
            let source_id = item.source_id;
            let source_Info = JSON.parse(item.info);
            let base_save_path = path.join('E:/corpus/segment', source_id.toString());
            base_save_path = base_save_path.replace(/\\/g, '/');

            // 判断路径是否存在, 不存在则创建路径
            if (!fs.existsSync(base_save_path)) {
                fs.mkdirSync(base_save_path);
            }

            // 获取文件后缀名
            let ext = path.extname(source_path);

            async.map(source_Info, function (source_Info_item, source_Info_callback) {

                let start = (source_Info_item['start'].toString()).replace(/\./, "s");
                let end = (source_Info_item['end'].toString()).replace(/\./, "s");

                let save_path = `${base_save_path}/${source_id}_${start}-${end}${ext}`;

                ffmpeg(source_path)
                    .outputOption([
                        `-flags bitexact`,
                        `-ss ${source_Info_item['start']}`,
                        `-to ${source_Info_item['end']}`
                    ])
                    .save(save_path)
                    .on('error', (err) => {
                        logger.error(err);
                    })
                    .on('end', () => {
                        source_Info_callback(null, save_path);
                    })
            }, function (err, source_Info_audio) {
                if(err){
                    logger.error(err);
                }else {
                    valid_audio_callback(null, source_Info_audio);
                }

            });

        }, function (err, result) {

            if(err){
                logger.error(err);
            }else {
                let segment_audio_list = [];

                for (let i = 0; i < result.length; i++) {
                    let item = result[i];

                    for (let j = 0; j < item.length; j++) {
                        segment_audio_list.push(result[i][j]);
                    }
                }

                resolve(segment_audio_list);
            }

        })

    });
}
