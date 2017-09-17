#!/usr/bin/env node

//pm2 传参数的启动方式
//BS_ENV=production pm2 restart main -- --max-old-space-size=200
var cluster = require('cluster');
var protocol = process.env.APP_PROTOCOL || 'http';
var cpuCount = require('os').cpus().length;

var logHelper = null;
var startUpLogger = null;
var exLogger = null;
var cf = require('../src/core/common-func');
function createServer(app) {
    var protocol = process.env.APP_PROTOCOL || 'http';
    console.log('the protocol for web server is:' + protocol);
    var serverCreator = require('http');
    var serverOptions = {};
    if (protocol == 'https') { //启用https协议
        serverCreator = require('https');
        serverOptions = {
            key: require('fs').readFileSync('./213720472350698.key'),
            cert: require('fs').readFileSync('./213720472350698.pem')
        };
        return serverCreator.createServer(serverOptions, app);
    } else {
        return serverCreator.createServer(app);
    }
}

//这里一定是在设置workerCache后才能require logHelper,因为helper内部依赖workerId是否设置来确定日志前缀是worker还是master
logHelper = require('../support/logger/helper');
logHelper.configure({id:1,process:{pid:1}}, require('../config/log4js'));

startUpLogger = logHelper.getLogger('startUp');
exLogger = logHelper.getLogger('exception');
sqlLogger = logHelper.getLogger('sql');

var app = require('./framework-engin/express');``
var debug = require('debug')('web_with_express4:server');



var server = createServer(app);
//在所有的网卡上监听指定的端口号
server.listen(app.get('port'));
server.on('error', onError);
server.on('listening', onListening);

process.on('uncaughtException', function (err) {
    console.log('------------------uncaughtException------------------');
    //打印出错误的调用栈方便调试
    exLogger.info(err);
});


/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string' ?
        'Pipe ' + port :
        'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    startUpLogger.info('Listening on ' + bind);
    debug('Listening on ' + bind);
}