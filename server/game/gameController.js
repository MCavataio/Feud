var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var natural = require('natural');


module.exports = {

  fuzzyCheck: function(req, res, next) {
    var responses = req.body.responses
    var guess = req.body.guess
    var greatest = {
      value: .1,
      index: null
    } 
    for (var i = 0; i < responses.length; i++) {
      var ratio = natural.JaroWinklerDistance(responses[i], guess)
      if (ratio > greatest.value) {
        greatest.value = ratio;
        greatest.index = i
      }
    }
    res.json(greatest);

  },
  getQueries: function(room) {
    helpers.getCount()
    .then(function(size) {
      return helpers.getQueries(helpers.getNumbers(size))
    })
    .then(function(gameQuestions) {
      // gameQuestions[8] = room.value
      room.io.to(room.value).emit('startRound', gameQuestions)
    })
    .catch(function(err) {
      console.log(err)
    })
  }

  // startRound: function(req, res, next) {
  //   console.log(req.params.id)
  //   helpers.getQuery(req.params.id, function (err, response) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //         req.io.sockets.to('req.paramas.id').emit('playRound', response)
  //       // res.json(response);
  //     }
  //   })
  // },
}
