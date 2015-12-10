var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var socket = require('./sockets/sockets.js')(io);


require('./config/middleware.js')(app, express, io);


var port = process.env.PORT || 3000;

http.listen(port)

console.log("connected to port: ",port)
module.exports = app;
