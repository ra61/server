const { EventEmitter } = require('events');
const emitter = new EventEmitter();
emitter.on('update', (data) => {
    console.log(data);
});

module.exports = emitter;