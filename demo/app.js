var IOReqEv = require('socket.io-reqev');
var ioReqEv = new IOReqEv(require('socket.io').listen(50000));
var Timer = require('./timer');
ioReqEv.register("/timer",new Timer());

//temporary web server
var static = require('node-static');
var file = new static.Server('.');
require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    }).resume();
}).listen(8080);
