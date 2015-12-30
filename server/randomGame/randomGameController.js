var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.RandomGame;
var natural = require('natural');
var roundOne;


module.exports = {
  playGame: function(user, socket) {
    var gameID;
    var userCol;
    // finds game where there is an open slot or creates a new game
    return helpers.findRandomGame(user)
    .then(function(game) {
      // checks whether it was a game with an open slot with different player
      if (game[0].dataValues.user1 !== user) {
        roundOne = game[0].dataValues.questionRD1
        game = game[0].dataValues.id;
        gameID = game
        userCol = 'user2'
        // updates game to include reference to oppents namne in slot 2
        return helpers.updateOpponent(game, user)
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
          gameID = game;
          userCol = 'user1'
          return helpers.updateRandomGame(game, numbers, lightning)
        })
      }
    })
    .then(function(response) {
      // searches for first round question
      return helpers.getQuery({number: roundOne})
    })
    .then(function(question) {
      // sends to respective user
      console.log(gameID, "+++++++++++++++++++++++++++---------------------")
      question = {
        question: question,
        game: gameID,
        user: userCol
      }
      socket.io.to(socket.id).emit('playRandom', question)
    })
// })
//     .catch(function(error) {
//       console.log(error)
//     })
}, updateScores: function(data) {
  console.log(data, "get that dataaaaaaa")
  var user = data.userCol;
  var round = data.round;
  var score = data.score;
  var game = data.gameID;
  console.log(user, round)
  if(user === 'user1' && round == 1) {
    var update = {
      user1RD1: score,
      turn: 'user2'
    }
    console.log('calling helpers +++++++')
    helpers.updateScores(update, game)
  }
}
}