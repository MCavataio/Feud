var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;
var rooms = [];


module.exports = {
  addQuery: function (req, res, next) {
    var query = req.body.query
    helpers.findOrCreateQuery(query)
  },
  createRoom: function(req, res, next) {
    if(rooms.length > 0) {
      // console.log('in createRoom', rooms);
      var last = rooms.length - 1;
      // console.log(rooms[last].full, "+++++++++++")
        if (rooms[last].full === false) {
          rooms[last].full = true;
        } else {
          var value = rooms[last].value
          value++
          rooms.push({value: value, full: false})
          // console.log(rooms,"in else adding new +++++++++++")
        }
    } else {
      
      rooms.push({value: 1, full: false});
      // console.log(rooms, "in else")
    }
    // console.log(rooms, "before sending ++=+======+++")
    res.json({room: rooms[rooms.length -1].value})
  }
}