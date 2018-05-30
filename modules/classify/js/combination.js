const _ = require('lodash');
const { logger } = require('./log4js');


function combinnation(arr) {

    if(arr.length === 0){
        logger.error('分类参数错误：长度不能为零');
        return;
    }

    for(let i = 0;i < arr.length;i++){
        if(!_.isArray(arr[i])){
            logger.error('分类参数错误：元素类型必须为数组');
            return;
        }
    }

    if(arr.length === 1){
        return arr[0];
    }

    let result = [];

    if(arr.length === 2){
        for(let i = 0;i < arr[0].length;i++){
            for(let j = 0; j < arr[1].length;j++){
                result.push(arr[0][i] + '-' + arr[1][j]);
            }
        }
    }

    if (arr.length >= 3){

        let temp = [];
        for(let i = 0;i < arr[0].length;i++){
            for(let j = 0; j < arr[1].length;j++){
                temp.push(arr[0][i] + '-' + arr[1][j]);
            }
        }

        arr.shift();
        arr.shift();
        arr.unshift(temp);
        return arguments.callee(arr);
    }

    return result;
}

module.exports = combinnation;