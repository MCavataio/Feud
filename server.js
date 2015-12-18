
var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '161881',
  key: '48afec95468f47903d06',
  secret: '9244fc97634259f464f2',
  encrypted: true
});
pusher.port = 443;

pusher.trigger('test_channel', 'my_event', {
  "message": "hello world"
});

var socket = require('./server/sockets/sockets.js')(io);


require('./server/config/middleware.js')(app, express, io);


var port = process.env.PORT || 3000;

http.listen(port)

console.log("connected to port: ",port)
module.exports = app;