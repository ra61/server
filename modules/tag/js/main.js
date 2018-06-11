const  getSegInfo = require('./getSegInfo');
const  getSegInfoAll = require('./getSegInfoAll');
const  getAudioInfo = require('./getAudioInfo');
const  audioExporting = require('./audioExporting');
const infoExporting = require('./infoExporting');

module.exports = async function  (req, res, next) {
    let subproject_id = +req.params.subproject_id;
    let batch_id = +req.params.batch_id;
    
    // 导出音频列表
    let seg_info_list;

    if(batch_id === 0){
        seg_info_list = await getAllSegInfo(subproject_id);
    } else {
        seg_info_list = await getSegInfo(batch_id);
    }

    // 导出路径
    let output_path = 'E:/corpus/tag';

    // 导出音频参数列表
    let audioInfo = await getAudioInfo(seg_info_list, output_path);
    
    // 导出音频信息
    infoExporting(audioInfo);
    // 导出以您
    audioExporting(audioInfo, batch_id);

}