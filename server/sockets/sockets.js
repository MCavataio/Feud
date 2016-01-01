var GC = require('../game/gameController.js');
var HC = require('../home/homeController.js');
var RC = require('../randomGame/randomGameController.js');
var helpers = require('../config/helpers.js');
var rooms = {};
var users = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    
    console.log(socket.id, "connected")
    // fuzzy check call
    socket.on('fuzzyCheck', function(data) {
      data.id = this.id
      data.io = io
      GC.fuzzyCheck(data);
    })

    // saves userInfo to database
    socket.on('userInfo', function(user) {
      user.socket = this.id
      user.io = io
      HC.user(user);
    })

    //************************************************
    // initializes games for playing Random Opponent
    socket.on('playRandom', function(user) {
      console.log('in playRandom')
      var socket = {
        id: this.id,
        io:io
      }
      RC.playGame(user, socket)
    })
    socket.on('playFriend', function(info) {
      var socket = {
        id: this.id,
        io: io
      }
      RC.playFriend(info, socket);
    })
    // once both users are on game page send data
    // socket.on('initGame', function(data) {
    //   if (data.name) {
    //     var user = {
    //       user: data.name,
    //       id: this.id,
    //       io: io
    //     }
    //     RC.sendQuestion(user);
    //   }
    //   var room = {
    //     value: this.rooms[1],
    //     io: io
    //   }
    //   if (rooms[room]) {
    //     GC.getQueries(room)
    //     delete rooms[room]
    //   } else {
    //     rooms[room] = true;
    //   }
    // })
    socket.on('updateHome', function(user) {
      user = {
        name: user,
        isPlayer: true,
        socket: this.id,
        io: io
      }
      HC.updateHome(user)
    })
    socket.on('getQueries', function(ids) {
      var ids = {
        ids: ids,
        socket: this.id,
        io: io
      }
      HC.getQueries(ids)
    })

    // pairs random users to play against one another
    // socket.on('changeRoom', function(data) {
    // // data is the room number received from emit from queryController
    // var nRoom = {
    //   value: data.room.data.room,
    //   io: io
    // }
    // // joins respective room
    // if(!this.rooms[1]) {
    //   socket.join(nRoom.value);
    //   // checks to see how many users are in current room;
    //   var room = io.sockets.adapter.rooms[nRoom.value];
    //   var length = Object.keys(room).length
    //   if (length === 2) {
    //     io.sockets.to(nRoom.value).emit('playRound', {room: nRoom.value})
    //   }
    // }
    // })
    // socket.on('leaveRoom', function() {
    //   socket.leave(this.rooms[1]);
    // })
    // sends scores to other individuals playing in the same room
    // this.rooms consists of connection id and room number
    socket.on('updateScore', function(data) {
      var socket = {
        id: this.id,
        io: io
      }
      RC.updateScores(data, socket)
      // if want to go live
      // socket.broadcast.to(this.rooms[1]).emit('updateScore', {score: data})
      // console.log(this.rooms, this.id);
    })
    socket.on('addPotential', function(data) {
      HC.addPotential(data);
    })
    socket.on('disconnect', function(socket) {
      var info = {
        id: this.id
      }
      HC.logout(info)
    })
  })
}