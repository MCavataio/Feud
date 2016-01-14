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

    socket.on('updateHome', function(data) {
      console.log(data)
      var user = {
        name: data.name,
        isPlayer: true,
        socket: socket.id,
        io: io
      }
      if (!socket.clientID) {
        return helpers.findUser(user)
        .then(function(userInfo) {
          if (!userInfo) {
            console.log('here')
            return helpers.findOrCreateUser(user)
            .then(function(userData) {
              console.log('in find or create')
              socket.clientID = userData[0].dataValues.id;
              HC.updateHome(user)
            })
          } else if (!userInfo.dataValues.online) {
            console.log('about to update')
            return helpers.updateUser(user)
            .then(function(userData) {
              socket.clientID = userInfo.dataValues.id;
              HC.updateHome(user);
            })
          } else {
            console.log(' in else')
            socket.clientID = userInfo.dataValues.id;  
            HC.updateHome(user);
          }
        })
      } else {
        HC.updateHome(user);
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
    })

    socket.on('addPotential', function(data) {
      HC.addPotential(data);
    })

    socket.on('disconnect', function() {
      if (socket.clientID) {
        helpers.logout(socket.clientID)
      }
    })
  })
}