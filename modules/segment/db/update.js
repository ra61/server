
const segmentAudioModel = require('./model');
 
module.exports = async function (batch_id, update_data) {
    segmentAudioModel.findOneAndUpdate(
        // 根据ID查询
        {batch_id:batch_id},
        // 数据
        update_data,
        // 存在时更新，不存在时保存
        {upsert: true}, 
        // 回调函数
        function(err, data){
            if (err) {
                next(err);
            }
        });
}
    