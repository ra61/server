const async = require('async');
const fs = require('fs');

module.exports = function(audio_info_list, callback){

    let counter = 0;
    let total = audio_info_list.length

    // 遍历存在的文件
    for (let i = 0; i < audio_info_list.length; i++) {

        let item = audio_info_list[i];

        let key_value=[];

        for(let key in item.text){
            key_value.push(key + ":" + item.text[key]);
        };

        let write_content = key_value.join("\r\n");

        fs.writeFile(item.write_file, write_content, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('success');
            }
        });


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

            readStream.on('error', function(err){
                callback(err);
            });

            writeStream.on('drain', function () {
                readStream.resume();
            });

            writeStream.on('close', function(){

                counter++;
                rate = counter + '/' + total;

                // 计算导出进度
                // rate = (exportedSize / totalSize * 100).toFixed(2) + '%';

                callback(null, {exported_rate: rate,exported_counter: counter, total_audio: total});
            });

            writeStream.on('error', function(err){
                callback(err);
            });

        }
    }
}