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
  findOrCreateUser: function (user) {
    console.log(user)
    return new Promise(function (resolve, reject) {
      db.User.findOrCreate({
        where: {
          name: user.username,
        }, defaults: {
          password: user.password
        }
      }).spread(function (user, created) {
        resolve(user, created)
      }).catch(reject)
    })
  },
  getCount: function(cb) {
    db.Query.findAndCountAll({})
    .then(function (size) {
      console.log(size, '++++++++++++++++++ in findAndCountAll')
      cb (null, size);
    }).catch(function (err) {
      cb(err);
    })

  },
  getQuery: function(id, cb) {
    db.Query.findOne({where: {id: id}})
    .then(function (query) {
      console.log(query, "++++++++++++++-------------------")
      cb(null, query)
    }).catch(function (err) {
      cb(err);
    })
  },
  
  getNumbers: function(response, cb) {
    var numbers = [];
    var queries = {};
      for (var i = 1; i <= 3; i++ ) {
        var count = 0;
        while(count < 1) {
          var randomIndex = Math.ceil(Math.random() * response.count)
          if(numbers.indexOf(randomIndex) === -1) {
            count++
            numbers.push(randomIndex);
          } 
        }
      }
    if (numbers) {
      cb(null, numbers);
    } else {
      cb(numbers);
    }
  },

  // getGameQueries: function(cb) {
  //  console.log('inside get Queries +++++++++++++++++++')
  //  this.getCount(function(err, response) {
  //     if (err) {
  //       console.log(err);
  //     } else {
  //       this.getNumbers(response, function(err, response) {
  //         if (err) {
  //           console.log(err) 
  //         } else {
  //           this.getQueries(response, function(err, queries) {
  //             if (queries) {
  //               cb(null, queries)
  //             } else {
  //               // return response
  //               cb(queries);
  //               // queries.room = room.value
  //               // room.io.to(room.value).emit('startRound', queries)
  //               // res.json(queries);
  //             }
  //           });
  //         }
  //       })  
  //     }
  //   })
  // },

  getQueries: function(ids, cb) {
    db.Query.findAll({where: {id: ids}
    })
    .then(function (query) {
      cb(null, query)
    }).catch(function (err) {
      cb(err);
    })
  }

}