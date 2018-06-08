const async = require('async');
const fs = require('fs');
const emitter = require('./saveRate');

module.exports = function(audio_info_list){

    let counter = 0;
    let total = audio_info_list.length;

    async.each(audio_info_list, (item, callback) => {

        let read_audio = item.read_audio;
        let write_audio = item.write_audio;

        let stat = fs.statSync(read_audio);

        if (stat && stat.isFile()) {

            let readStream = fs.createReadStream(read_audio);
            let writeStream = fs.createWriteStream(write_audio);

            readStream.on('data', function (chunk) {
                // exportedSize += chunk.length;
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
                rate = counter + '/' + total;

                // 计算导出进度
                // rate = (exportedSize / totalSize * 100).toFixed(2) + '%';
                emitter.emit('update', { exported_rate: rate, exported_counter: counter, total_audio: total })
            });

            writeStream.on('error', function (err) {
                callback(err);
            });

        }
    }, (err) => {
        console.log(err);
    });

}

