var express = require ('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http)
var GC = require('./game/gameController.js');
// var db = require("./db/dbconfig.js");

require('./config/middleware.js')(app, express, io);


// var nsp = io.of('/practice');
// nsp.on('connection', function(socket){
//   console.log('someone connected'):
// });
// nsp.emit('hi', 'everyone!');
// var nsp = io.of('/1');
// nsp.on('connection', function(socket) {
//   // console.log(conn.id);
//   console.log(socket.id, "connected in nsp")
//   if (socket.server.eio.clientsCount > 2) {
//     nsp.emit('playRound', 'everyone')
//   } 
//   //     'sync disconnect on unload': true });
//   // connections.push(conn.id);
//   socket.on('disconnect', function() {
//     console.log(this.id, "logged out")
//   });

// })

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

    //    ) function(err, queries) {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     console.log(queries)
    //     io.sockets.in(nRoom).emit('startRound', queries)
    //   }
    // })
  }
  // console.log(socket.room)
})
socket.on('getQueries', function() {
  // console.log(this)
})
})



var port = process.env.PORT || 3000;


http.listen(port)

console.log("connected to port: 3000")
module.exports = app;
