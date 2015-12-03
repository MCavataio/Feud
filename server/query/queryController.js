var db = require('../db/dbConfig.js');
var Q = require('q');
var helpers = require('../config/helpers.js')
var Promise = require('bluebird');
var Query = db.Query;

module.exports = {
  addQuery: function (req, res, next) {
    var query = req.body.query
    helpers.findOrCreateQuery(query)
  }
}