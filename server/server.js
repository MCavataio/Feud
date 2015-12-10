var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var GC = require('./game/gameController.js');
// var db = require("./db/dbconfig.js");

require('./middleware.js')(app, express, io);


io.on('connection', function(socket) {
  console.log(socket.id, "connected")

socket.on('changeRoom', function(data) {
  // data is the room number received from emit from queryController
  var nRoom = {
    value: data.room.data.room,
    io: io
  }
  // joins respective room
  socket.join(nRoom.value);
  // checks to see how many users are in current room;
  var room = io.sockets.adapter.rooms[nRoom.value];
  var length = Object.keys(room).length
  if (length === 2) {
    io.sockets.to(nRoom.value).emit('playRound', {room: nRoom.value})
    setTimeout(function() {
      GC.getQueries(nRoom) 
    }, 2000)
  } 
  // console.log(socket.room)
})
socket.on('updateScore', function(data) {
  // console.log(this)
  console.log('from client' + data);
  
})
})

io.on('disconnect', function(conn) {
  console.log(conn.id, " disconnected")
})



var port = process.env.PORT || 3000;


http.listen(port)

console.log("connected to port: 3000")
module.exports = app;
