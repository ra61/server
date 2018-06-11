const fs = require('fs');
const async = require('async');
const { logger } = require('./log4js');

module.exports = function(audio_info_list){

        async.each(audio_info_list, function(item, callback){
            
            let key_value = [];
    
            for(let key in item.text){
                key_value.push(key + ":" + item.text[key]);
            };
    
            let write_content = key_value.join("\r\n");
    
            fs.writeFile(item.write_file, write_content, (err) => {
                if (err) {
                    callback(err)
                } else {
                    logger.info(item.path + ' 信息写入成功');
                }
            });

        }, (err) => {
            logger.error(err);
        });

}