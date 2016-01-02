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
      console.log('user')
      user = {
        name: user.name,
        isPlayer: true,
        socket: socket.id,
        io: io
      }
      if (!socket.clientID) {
        console.log('73 -------------------', user)
        console.log('1111111111111111')
        return helpers.findUser(user)
        .then(function(userInfo) {
          console.log('76 +++++++++++++++++++++++++++', userInfo)
          if (!userInfo) {
            console.log('calling find or create user')
            console.log('2222222222222222222')
            return helpers.findOrCreateUser(user)
            .then(function(userData) {
              socket.clientID = userData[0].dataValues.id;
                if(user.updatedUser) {
                io.to(socket.id).emit('updateHome', "true")
              } else {
                HC.updateHome(user);
              }
            }).catch(function(err) {
              console.log(err)
            })
          } if (!userInfo.dataValues.online) {
            console.log('hereeeeeeeeeeeeeeeeee')
            console.log('333333333333333333333')
            return helpers.updateUser(user)
            .then(function(userData) {
              console.log(userInfo.dataValues.id)
              socket.clientID = userInfo.dataValues.id;
              if(user.updatedUser) {
                io.to(socket.id).emit('updateHome', "true")
              } else {
                HC.updateHome(user);
              }
            }).catch(function(err) {
              console.log(err)
            })
          }
          else {
            console.log('44444444444444444')
            socket.clientID = userInfo.dataValues.id;  
              if(user.updatedUser) {
                io.to(socket.id).emit('updateHome', "true")
              } else {
                HC.updateHome(user);
              }
          }
        }).catch(function(err) {
          console.log(err)
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