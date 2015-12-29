var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.RandomGame;
var natural = require('natural');


module.exports = {
  playGame: function(user, socket) {
    console.log('inside playGame');
    return helpers.findRandomGame(user)
    .then(function(game) {
      console.log(game)
      if (game[0].dataValues.user2 === 'open') {
        return helpers.getCount()
        .then(function(response) {
          return helpers.getNumbers(response)
        })
        .then(function(numbers) {
          var lightning = numbers.slice(3);
          lightning = lightning.join("A")
          game = game[0].dataValues.id

          console.log(typeof(game), "+++++++")
          return helpers.updateRandomGame(user, numbers, lightning)
        })
        .then(function(updated) {
          console.log('in here+++++++++++++++')
          socket.io.to(socket.id).emit('playRandom', 'fake')
        })
      }
    })
    .catch(function(error) {
      console.log(error)
    })
  },
  sendQuestion: function(user) {
    console.log(user, "here in send question++++++++++++")
  }
}
  // player wants to play game
  // find if there is an available room
  // if there is available room
    // send player questions that were stored in room and user
    // send player question
    // save question round
    // info of opponent
  // else create new game
    // going to have to get numbers
    // save user name to random game along with random numbers



  //   helpers.getCount()
  //   .then(function(size) {
  //     return helpers.getQueries(helpers.getNumbers(size))
  //   })
  //   .then(function(ids) {
  //     console.log(ids);
  //   })

  // })
