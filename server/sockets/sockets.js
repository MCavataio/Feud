var GC = require('../game/gameController.js');
var HC = require('../home/homeController.js');
var rooms = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    var socket = this.rooms[0];
    console.log(socket.id, "connected")
    socket.on('userInfo', function(user) {
      user.socket = socket;
      HC.user(user);
    })
    // once both users are on game page send data
    socket.on('initGame', function(data) {
      var room = {
        value: this.rooms[1],
        io: io
      }
      if (rooms[room]) {
        GC.getQueries(room)
        delete rooms[room]
      } else {
        rooms[room] = true;
      }
    })

    // pairs random users to play against one another
    socket.on('changeRoom', function(data) {
    // data is the room number received from emit from queryController
    var nRoom = {
      value: data.room.data.room,
      io: io
    }
    // joins respective room
    if(!this.rooms[1]) {
      
      socket.join(nRoom.value);
      // checks to see how many users are in current room;
      var room = io.sockets.adapter.rooms[nRoom.value];
      var length = Object.keys(room).length
      if (length === 2) {
        io.sockets.to(nRoom.value).emit('playRound', {room: nRoom.value})
        // setTimeout(function() {
        //   GC.getQueries(nRoom) 
        // }, 2000)
      }
    }
    })
    socket.on('leaveRoom', function() {
      console.log(this.rooms, "before+++++++++++++++++++++++")
      socket.leave(this.rooms[1]);
      console.log(this.rooms, "++++++++++++++++++++++")
    })
    // sends scores to other individuals playing in the same room
    // this.rooms consists of connection id and room number
    socket.on('updateScore', function(data) {
      socket.broadcast.to(this.rooms[1]).emit('updateScore', {score: data})
      // console.log(this.rooms, this.id);
    })
  })
}