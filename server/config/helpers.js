var db = require('../db/dbConfig.js');
var Query = db.Query;
var Promise = require('bluebird')

module.exports = {
  findOrCreateQuery: function (newQuery) {
    return new Promise(function (resolve, reject) {
      db.Query.findOrCreate({
        where : {
          title: newQuery.title
        }, defaults: {
          response1: newQuery.response1,
          response2: newQuery.response2,
          response3: newQuery.response3,
          response4: newQuery.response4,
          response5: newQuery.response5,
          response6: newQuery.response6,
          response7: newQuery.response7,
          response8: newQuery.response8,
          response9: newQuery.response9,
          response10: newQuery.response10
        }

      }).spread(function (query, created) {
        resolve(query, created)
      }).catch(reject);
    })
  },
  getCount: function(cb) {
    db.Query.findAndCountAll({}).then(function (size) {
      cb (null, size);
    }).catch(function (err) {
      cb(err);
    })

  },
  getQuery: function(id, cb) {
    db.Query.findOne({where: {id: id}})
    .then(function (query) {
      cb(null, query)
    }).catch(function (err) {
      cb(err);
    })
  }

}