// 加载mongoose
const { mongoose } = require('../../common');

// 定义数据模式
let segmentAudioSchema = new mongoose.Schema({
    batch_id:Number,
    exported_rate: String,
    exported_counter: Number,
    total_audio: Number,
    totalSize: Number,
    exist_audio: Array,
    not_exist_path: Array,
    not_audio: Array,
    valid_audio: Array,
    invalid_audio: Array,
    other_audio: Array,
    not_exist_valid_audio: Array
});

// 定义Model
let segmentAudioModel = mongoose.model('segmentAudioModel', segmentAudioSchema);

module.exports = segmentAudioModel;