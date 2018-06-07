const  getSegInfo = require('./getSegInfo');
const  getSegInfoAll = require('./getSegInfoAll');
const  getAudioInfo = require('./getAudioInfo');
const  audioExporting = require('./audioExporting');


module.exports = async function  (req, res, next) {
    let subproject_id = +req.params.subproject_id;
    let batch_id = +req.params.batch_id;
    let seg_info_list;

    if(batch_id === 0){
        seg_info_list = await getAllSegInfo(subproject_id);
    } else {
        seg_info_list = await getSegInfo(batch_id);
    }

    console.log(`预计导出${seg_info_list.length}条已编辑音频数据`);

    let output_path = 'E:/corpus/tag';

    let audioInfo = await getAudioInfo(seg_info_list, output_path);

    console.log(audioInfo);

    audioExporting(audioInfo, function(err, result){
        console.log(result);
    });


}