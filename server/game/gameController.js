var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;


module.exports = {
  getCount: function(req, res, next) {
    helpers.getCount(function(err, response) {
      if (err) {
        console.log(err);
      } else {  
        res.json(response);
      }
    })
  },
  // var participants = [];
  startRound: function(req, res, next) {
    console.log(req.params.id)
    helpers.getQuery(req.params.id, function (err, response) {
      if (err) {
        console.log(err);
      } else {
        // if(participants.length > 1) {
          
          req.io.emit('playRound', response);

        // }
        res.json(response);
      }
    })
  },
  startGame: function(req, res, next) {

  }
}
