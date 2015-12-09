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
  // this.leave(this.room)
  // this.join("" + data.room)
  var nRoom = {
    value: data.room.data.room,
    io: io
  }
  socket.join(nRoom.value);
  console.log(nRoom.value, "++++++++++++++++")
  var room = io.sockets.adapter.rooms[nRoom.value];
  var length = Object.keys(room).length
  console.log(length)
  if (length === 2) {
    io.sockets.to(nRoom.value).emit('playRound', {room: nRoom.value})
    GC.getQueries(nRoom)

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
})






http.listen(3000)

console.log("connected to port: 3000")
module.exports = app;
