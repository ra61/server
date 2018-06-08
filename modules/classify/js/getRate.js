const classifyAudioModel = require('../db/model');
module.exports = function (req, res, next) {
    let batch_id = req.params.batch_id;
    // 链式查询
    classifyAudioModel.where('batch_id').eq(batch_id).exec(function (err, docs) {
        if (err) {
            next(err);
        } else {
            res.json(docs);
        }
    });
};