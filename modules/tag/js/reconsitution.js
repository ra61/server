const async = require('async');

module.exports = function(list){

    return new Promise( resolve => {
        async.map(list, function(item, callback){
            let info_str = Object.assign({attributes:{},text:""}, JSON.parse(item.info));
            let obj={
                    path:item.path,
                    text:{
                        SubProjectId:item.subproject_id,
                        SourceId:item.source_id,
                        Delete:item.invalid || 2,
                        Text:info_str.text,
                    }
                };
            obj.text = Object.assign(obj.text, info_str.attributes);
            callback(null, obj);
        },function(err, result){
            resolve(result);
        });
    })
    
}