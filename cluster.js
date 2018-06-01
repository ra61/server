const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const app = require('./app.js');
const { logger } = require('./log4js');
const exec = require('child_process').exec;

if (cluster.isMaster) {
  for (var i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    worker.send('[master] ' + 'fork [worker' + worker.id +']');
  }

  // cluster.on('fork', (worker) => {
  //   console.log('[worker ' + worker.id +'] ' + 'is forking.');
  // });

  // cluster.on('online', (worker) => {
  //   console.log('[worker ' + worker.id +'] ' + 'is online.');
  // });

  // cluster.on('listening', function(worker, address) {  
  //   console.log('[worker' + worker.id + '] ' +  'listening:' + address.address + ':' + address.port);  
  // });

  cluster.on('disconnect', (worker, code, signal) => {
    console.log('[worker' + worker.id +'] ' + `at pid ${worker.process.pid} disconnect`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('[worker ' + worker.id +'] ' + `at pid ${worker.process.pid} died`);
    cluster.fork();
  });

  cluster.on('message', (worker, msg) => {
    if(msg.type === 'feedback') {
      console.log('[worker' + worker.id + '] feedback message --' + msg.text);
    }
  });

  // each(cluster.workers, (worker) => {

  //   worker.on('message', msg =>{
  //     if(msg.type === 'feedback') {
  //       console.log(msg.text);
  //     }

  //   });

  // });

} else {

    // 设定监听端口
  app.set('port', process.env.PORT || 3000);
  // 创建服务
  const server = require('http').Server(app);
  // 监听端口
  server.listen(app.get('port'), 'localhost', function(){
    logger.info('[worker ' + cluster.worker.id +'] ' + 'listening on port: ' + server.address().port);
  });

  process.on('message', (msg) => {
    // console.log('[worker'+ cluster.worker.id +'] received message' + '--' + msg);
    process.send({type:'feedback', text:'[worker'+ cluster.worker.id +'] received message'});
  });

}

// function each(list, callback) {
//   for (const id in list) {
//     callback(list[id]);
//   }
// }


