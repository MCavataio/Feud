var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.RandomGame;
var natural = require('natural');
var roundOne;


module.exports = {
  playGame: function(user, socket) {
    // finds game where there is an open slot or creates a new game
    return helpers.findRandomGame(user)
    .then(function(game) {
      // checks whether it was a game with an open slot with different player
      if (game[0].dataValues.user1 !== user) {
        roundOne = game[0].dataValues.questionRD1
        game = game[0].dataValues.id;
        // updates game to include reference to oppents namne in slot 2
        return helpers.updateOpponent(game, user)
        .then(function(response) {
        // retrieves the query from the database that was already sent to player 1
          return helpers.getQuery({id: roundOne})
        })
        .then(function(question) {
        // send question to player 1 or send signal to switch to game room where the question
        // will then be sent
          socket.io.to(socket.id).emit('playRandom', question)
        })
      } else {
        // get counts of queries to determine how many random queries there are in database
        return helpers.getCount()
        .then(function(response) {
          // returns 8 random numbers based off the count value
          return helpers.getNumbers(response)
        })
        .then(function(numbers) {
          // parses information to be saved into database
          // lightning round is saved as string with A in between each 
          var lightning = numbers.slice(3);
          roundOne = numbers[0];
          lightning = lightning.join("A")
          game = game[0].dataValues.id
          return helpers.updateRandomGame(game, numbers, lightning)
        })
        .then(function(updated) {
          return helpers.getQuery({id: roundOne})
        .then(function(question) {
          socket.io.to(socket.id).emit('playRandom', question)
        })

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
