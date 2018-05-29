
const fs = require('fs');

function exporting(exist_audio, totalSize, callback) {

    // 当前导出数量
    let counter = 0;

    // 需要导出的音频总数
    let total = exist_audio.length;

    // 导出比率
    let rate = 0;

    // 导出大小
    let exportedSize = 0;

    // 遍历存在的文件
    for (let i = 0; i < exist_audio.length; i++) {

        let filePath = exist_audio[i];

        let stat = fs.statSync(filePath);

        if (stat && stat.isFile()) {

            let filename = filePath.substring(filePath.lastIndexOf('/'));

            let readStream = fs.createReadStream(filePath);
            let writeStream = fs.createWriteStream('E:/corpus/classify/' + filename);

            readStream.on('data', function (chunk) {
                exportedSize += chunk.length;
                if (writeStream.write(chunk) === false) {
                    readStream.pause();
                }
            });

            readStream.on('end', function () {
                writeStream.end();
            });

            writeStream.on('drain', function () {
                readStream.resume();
            });

            writeStream.on('close', function(){

                counter++;
                // rate = counter + '/' + total;

                // 计算导出进度
                rate = (exportedSize / totalSize * 100).toFixed(2) + '%';

                callback({exported_rate: rate,exported_counter: counter, total_audio: total});
            });

        }
    }
}

module.exports = exporting;
