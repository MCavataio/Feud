
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
 

var socket = require('./server/sockets/sockets.js')(io);


require('./server/config/middleware.js')(app, express, io);


process.on('unhandledRejection', function(reason, p){
    console.log("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason);
    // application specific logging here
});

var port = process.env.PORT || 3000;

http.listen(port)

console.log("connected to port: ",port)
module.exports = app;