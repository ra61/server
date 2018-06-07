
const async = require('async');

module.exports = function(seg_info_list, output_path){
    return new Promise(resolve => {
        async.map(seg_info_list, function(item, callback){

            let path = item.path;
            let write_file = output_path + '/' + path.match(/(?!\/)(?:[\w-]+)(?=\.)/)[0] + '.txt';
            let read_audio = path.match(/.+(?=\.san_convert\.mp3)/)[0];
            let audio_name = path.match(/([\w-\.]+)(?=\.san_convert\.mp3)/g)[0];
            let write_audio = output_path + '/' + audio_name;
            let form = audio_name.match(/\w+(?!\.)/)[0];
            
            item.write_file = write_file;
            item.read_audio = read_audio;
            item.write_audio = write_audio;
            item.text.Form = form;
        
            callback(null, item);
        }, function(err, result){
            resolve(result);
        });
    })
}

