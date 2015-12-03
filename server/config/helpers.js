var db = require('../db/dbConfig.js');
var Query = db.Query;
var Promise = require('bluebird')

module.exports = {
  findOrCreateQuery: function (newQuery) {
  var title = newQuery.title;
  var response1 = newQuery.response1;
  var response2 = newQuery.response2;
  var response3 = newQuery.response3;
  var response4 = newQuery.response4;
  var response5 = newQuery.response5;
  var response6 = newQuery.response6;
  var response7 = newQuery.response7;
  var response8 = newQuery.response8;
  var response9 = newQuery.response9;
  var response10 = newQuery.respose10;
    console.log(newQuery.response1 + "    ++++++++++++");
    return new Promise(function (resolve, reject) {
      db.Query.findOrCreate({
        where : {
          title: title
        }, defaults: {
          response1: response1,
          response2: response2,
          response3: response3,
          response4: response4,
          response5: response5,
          response6: response6,
          response7: response7,
          response8: response8,
          response9: response9,
          response10: response10
        }

      }).spread(function (query, created) {
        console.log(query)
        // resolve(query, created)
      }).catch(reject);
    })
  }
}