
const fs = require('fs');
const async = require('async');
const emitter = require('./save');

function audioExporting(exist_audio, totalSize, export_path, batch_id) {

    // 当前导出数量
    let counter = 0;

    // 需要导出的音频总数
    let total = exist_audio.length;
    emitter.emit('update', batch_id, { total_audio: total });

    // 导出比率
    let rate = 0;

    // 导出大小
    let exportedSize = 0;

    async.each(exist_audio, (filePath, callback) => {

        let stat = fs.statSync(filePath);

        if (stat && stat.isFile()) {

            let filename = filePath.substring(filePath.lastIndexOf('/'));

            let readStream = fs.createReadStream(filePath);
            let writeStream = fs.createWriteStream(export_path + filename);

            readStream.on('data', function (chunk) {
                exportedSize += chunk.length;
                if (writeStream.write(chunk) === false) {
                    readStream.pause();
                }
            });

            readStream.on('end', function () {
                writeStream.end();
            });

            readStream.on('error', function (err) {
                callback(err);
            });

            writeStream.on('drain', function () {
                readStream.resume();
            });

            writeStream.on('close', function () {

                counter++;
                // rate = counter + '/' + total;

                // 计算导出进度
                rate = (exportedSize / totalSize * 100).toFixed(2) + '%';

                emitter.emit('update', batch_id, { exported_rate: rate, exported_counter: counter });
            });

            writeStream.on('error', function (err) {
                callback(err);
            });

        }
    }, (err) => {
        console.log(err);
    });

}

module.exports = audioExporting;
