var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.RandomGame;
var natural = require('natural');


module.exports = {
  playGame: function(user) {
    console.log('inside playGame');
    helpers.findRandomGame(user)
    .then(function(response) {
      console.log(response)
    })
  }


  //   helpers.getCount()
  //   .then(function(size) {
  //     return helpers.getQueries(helpers.getNumbers(size))
  //   })
  //   .then(function(ids) {
  //     console.log(ids);
  //   })

  // })
}