var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var natural = require('natural');


module.exports = {
  //possible refactoring to get Queries
  // getCount: function(req, res, next) {
  //   console.log(req.param.id)
  //   helpers.getCount(function(err, response) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       res.json(response);
  //     }
  //   })
  // },

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
   helpers.getCount(function(err, response) {
      if (err) {
        console.log(err);
      } else {
        console.log(repsonse, 'count step 1 ++++++++++++++++++')
        helpers.getNumbers(response, function(err, response) {
          if (err) {
            console.log(err) 
          } else {
            console.log(response, 'get numbers step 2=========================')
            helpers.getQueries(response, function(err, queries) {
              if (err) {
                console.log(err);
              } else {
                console.log(response, 'queries step 3***************************')
                // return response
                // setting index 3 to the socket room back to the client
                queries[3] = room.value
                console.log(queries, "before being sent --------------------")
                room.io.to(room.value).emit('startRound', queries)
                // res.json(queries);
              }
            });
          }
        })  
      }
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
