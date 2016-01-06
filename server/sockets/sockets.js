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

    socket.on('updateHome', function(user) {
      user = {
        name: user.name,
        isPlayer: true,
        socket: socket.id,
        io: io
      }
      if (!socket.clientID) {
        helpers.findUser(user)
        .then(function(userInfo) {
          console.log(userInfo, 'find user begin from updaate home ----------------------------')
          if (!userInfo) {
            return helpers.findOrCreateUser(user)
            .then(function(userData) {
              socket.clientID = userData[0].dataValues.id;
              HC.updateHome(user)
            })
          } else if (!userInfo.dataValues.online) {
            console.log(' in users not online =-------------')
            return helpers.updateUser(user)
            .then(function(userData) {
              console.log(userData, 'if user is not online')
              socket.clientID = userInfo.dataValues.id;
              HC.updateHome(user);
            })
          } 
        })
      } else {
        console.log(' userr is online -------------')
            socket.clientID = userInfo.dataValues.id;  
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
      console.log(socket.clientID, '++++++++++++++++')
      helpers.logout(socket.clientID)
    })
  })
}