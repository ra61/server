// 加载mongoose
const { mongoose } = require('../../common');

// 定义数据模式
let segmentAudioSchema = new mongoose.Schema({
    batch_id:Number,
    exported_rate: String,
    exported_counter: Number,
    total_segment_audio: Number,
    not_exist_segment_audio: Array,
    exist_segment_audio: Array,
    valid_audio: Array,
    invalid_audio: Array,
    other_audio: Array,
    not_exist_valid_audio: Array
});

// 定义Model
let segmentAudioModel = mongoose.model('segmentAudioModel', segmentAudioSchema);

module.exports = segmentAudioModel;