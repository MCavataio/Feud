var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var HC = require('../home/homeController.js')
var Promise = require('bluebird');
var Query = db.RandomGame;
var natural = require('natural');
var roundOne;


module.exports = {
  playFriend: function(info, socket) {
    var rounds;
    var userCol;
    var gameID;
    var opponent;
    var opponentID;
    return helpers.getCount()
        .then(function(response) {
          // returns 8 random numbers based off the count value
          return helpers.getNumbers(response)
        })
        .then(function(numbers) {
          // parses information to be saved into database
          // lightning round is saved as string with A in between each 
          var lightning = numbers.slice(3);
          rounds = numbers[0];
          lightning = lightning.join('A');
          info.questionRD1 = numbers[0];
          info.questionRD2 = numbers[1];
          info.questionRD3 = numbers[2];
          info.questionRD4 = lightning
          return helpers.friendGame(info)
        })
        .then(function(response) {
            // searches for first round question
            console.log('in responseeeee')
          gameID = response.dataValues.id;
          opponent = response.dataValues.user2;
          opponentID = response.dataValues.user2ID;
          return helpers.getQueries(rounds)
        })
        .then(function(question) {
      // sends to respective user
      console.log(gameID, "+++++++++++++++++++++++++++---------------------")
      var gameInfo = {
        question: question,
        game: gameID,
        user: 'user1',
        opponent: opponent,
        opponentID: opponentID
      }
      console.log('should send')
      socket.io.to(socket.id).emit('playFriend', gameInfo)
    })
  },
  playGame: function(user, socket) {
    var gameID;
    var userCol;
    var rounds;
    var opponent;
    // finds game where there is an open slot or creates a new game
    return helpers.findRandomGame(user)
    .then(function(game) {
      // checks whether it was a game with an open slot with different player
      if (game[0].dataValues.user1 !== user.name) {
        rounds = [game[0].dataValues.questionRD1,game[0].dataValues.questionRD2]
        gameID = game[0].dataValues.id
        userCol = 'user2'
        opponent = game[0].dataValues.user1
        // updates game to include reference to oppents namne in slot 2
        return helpers.updateOpponent(gameID, user)
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
          rounds = numbers[0];
          lightning = lightning.join("A")
          game = game[0].dataValues.id
          gameID = game;
          userCol = 'user1';
          opponent = 'null';
          return helpers.updateRandomGame(game, numbers, lightning)
        })
      }
    })
    .then(function(response) {
      // searches for first round question
      return helpers.getQueries(rounds)
    })
    .then(function(question) {
      // sends to respective user
      console.log(gameID, "+++++++++++++++++++++++++++---------------------")
      question = {
        question: question,
        game: gameID,
        user: userCol,
        opponent: opponent
      }
      socket.io.to(socket.id).emit('playRandom', question)
    })
// })
//     .catch(function(error) {
//       console.log(error)
//     })
}, updateScores: function(data, socket) {
  var user = data.userCol;
  var round = data.round;
  var score = data.score;
  var game = data.gameID;
  var opponent = data.opponent;

  if(user === 'user1'){
    var update = {
      user1Total: score,
      turn: opponent,
      round: data.round
    } 
  }else {
    var update = {
      user2Total: score,
      turn: opponent,
      round: data.round
    }
  }
  if (opponent !== 'open') {
    var opponent = {
      name: opponent,
      isOpponent: true,
      io: socket.io,
      game: game
    }
  }
  return helpers.updateScores(update, game)
  .then(function(game) {
    if (opponent.name) {
     return HC.updateOpponentHome(opponent)
     .then(function() {
      console.log('success')
     })
    }
  })

}
}