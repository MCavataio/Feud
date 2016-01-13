var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var natural = require('natural');


module.exports = {
  fuzzyCheck: function(data) {
    var responses = data.responses
    var guess = data.guess
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
    data.io.to(data.id).emit('fuzzyCheck', greatest)
  },

  getQueries: function(room) {
    helpers.getCount()
    .then(function(size) {
      return helpers.getQueries(helpers.getNumbers(size))
    })
    .then(function(gameQuestions) {
      // gameQuestions[8] = room.value
      // console.log(console.log(gameQuestions));
      room.io.to(room.value).emit('startRound', gameQuestions)
    })
    .catch(function(err) {
      console.log(err)
    })
  }
}
