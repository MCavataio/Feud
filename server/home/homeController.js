var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var rooms = [];
var number = [];


helpers.getCount()
.then(function(response) {
  count = response.count
  count++
  number.push(count);
}).catch(function(err) {
  console.log(err)
})


module.exports = {
  addQuery: function (req, res, next) {
    var query = req.body.query
    helpers.getQuery({title: query.title})
    .then(function(response) {
      if (response === null) {
        query.number = number[0]
        return helpers.findOrCreateQuery(query, 'Query')
          .then(function(response) {
          console.log('successful')
          res.json(response);
          number[0]++
        })
      } else {
        res.json(response)
      }
    }).catch(function(err) {
      res.json(response);
    })
  },
  addPotential: function(data) {
    helpers.findOrCreateQuery(data, 'PotentialQuery')
  },

  user: function(userInfo) {
    helpers.findOrCreateUser(userInfo)
    .then(function(user) {
      // console.log(user, "before being send +++++++++++++++")
      // console.log(userInfo.socket);
      userInfo.io.to(userInfo.socket).emit('userInfo', user);
    }).catch(function(error) {
      console.log(error)
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