var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var rooms = [];
var number = [];


module.exports = {
  addQuery: function (req, res, next) {
    console.log('got request');
    var query = req.body.query
    helpers.getQuery({title: query.title}, function(err, response) {
      if (err) {
        console.log(err, "in errror ahhh")
      } else {
        // creating value to add for saving number since heroku automatically increments by 10
        if (response === null) {
          if (!number.length){
            number.push(1);
            query.number = number[0];
          } else {
            number[0]++
            query.number = number[0];
          }
          helpers.findOrCreateQuery(query)
          .then(function(response) {
            console.log('successful')
            res.json(response);
          }).catch(function(err) {
            res.json(response);
          })
        }
      }
    })
  },
  createRoom: function(req, res, next) {
    if(rooms.length > 0) {
      var last = rooms.length - 1;
        if (rooms[last].full === false) {
          rooms[last].full = true;
        } else {
          var value = rooms[last].value
          value++
          rooms.push({value: value, full: false})
        }
    } else {
      rooms.push({value: 1, full: false});
    }
    res.json({room: rooms[rooms.length -1].value})
  },
  login: function(req, res, next) {
    helpers.findOrCreateUser(req.body)
  }
}