const { EventEmitter } = require('events');
const emitter = new EventEmitter();
const update = require('../db/update');

emitter.on('update', async (batch_id, exported_info) => {
    // 更新导出进度到数据库
    await update(batch_id, exported_info);
});

module.exports = emitter;