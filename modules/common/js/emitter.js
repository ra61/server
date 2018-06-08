// 引入 events 模块
const { EventEmitter } = require('events');


module.exports = function () {
    // 创建 eventEmitter 对象
    const emitter = new EventEmitter();
    
    return emitter;
}