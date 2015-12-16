var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var rooms = [];
var number = 1;


module.exports = {
  addQuery: function (req, res, next) {
    console.log('got request');
    var query = req.body.query
    query.number = number;
    var count = Query.count();
    console.log(count)
    helpers.findOrCreateQuery(query)
    .then(function(response) {
      console.log('successful');
      if (Query.count() > count) {
        number++;
      }
      res.json(response);
    }).catch(function(err) {
      res.send(err);
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