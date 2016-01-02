
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var Promise = require('bluebird')


var socket = require('./server/sockets/sockets.js')(io);


require('./server/config/middleware.js')(app, express, io);


Promise.onPossiblyUnhandledRejection(function(reason) {
        // do some custom logging
    console.log("possibly unhandled rejected Promise", reason);
    process.exit(1);
});

var port = process.env.PORT || 3000;

http.listen(port)

console.log("connected to port: ",port)
module.exports = app;