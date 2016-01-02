var GC = require('../game/gameController.js');
var HC = require('../home/homeController.js');
var RC = require('../randomGame/randomGameController.js');
var helpers = require('../config/helpers.js');
var rooms = {};
var users = {};

module.exports = function(io) {
  io.on('connection', function(socket) {
    
    socket.on('checkingIn', funciton(data) {
      users[socket.id] = data.name
      users[data.name] = socket.id
      console.log(users)
    })
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
        socket: socket.id,
        io: io
      }
      if (!socket.clientID) {
        return helpers.findOrCreateUser(user)
        .then(function(userInfo) {
          if (!user) {
            return helpers.updateUser(user)
            .then(function(userData) {
              socket.clientID = userData.dataValues.id;
              HC.updateHome(user);
            });
          } if (!userInfo[0].dataValues.online) {
            console.log('hereeeeeeeeeeeeeeeeee')
            return helpers.updateUser(user)
            .then(function(userData) {
              console.log(userInfo[0].dataValues.id)
              socket.clientID = userInfo[0].dataValues.id;
              HC.updateHome(user);
            })
          }
          else {
            socket.clientID = userInfo[0].dataValues.id;  
            HC.updateHome(user); 
          }
        })
      }
    })

    socket.on('getQueries', function(ids) {
      var ids = {
        ids: ids,
        socket: this.id,
        io: io
      }
      HC.getQueries(ids)
    })

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
    socket.on('disconnect', function() {
      console.log(socket.clientID, '++++++++++++++++')
      helpers.logout(socket.clientID)
    })
  })
}