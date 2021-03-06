// 加载mongoose
const mongoose = require('./mongoose');

// 定义数据模式
let tagAudioSchema = new mongoose.Schema({
    batch_id:Number,
    exported_rate: String,
    exported_counter: Number,
    total_audio: Number,
    totalSize: Number,
    valid_audio: Array,
    invalid_audio: Array,
    other_audio: Array,
    exist_audio: Array,
    not_exist_audio: Array,
    not_audio: Array
});

// 定义Model
let tagAudioModel = mongoose.model('tagAudioModel', tagAudioSchema);

module.exports = tagAudioModel;