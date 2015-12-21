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
          number: newQuery.number,
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
  
  getCount: function() {
    return new Promise(function (resolve, reject) {
      db.Query.findAndCountAll({})
      .then(function(size) {
        resolve(size)
      })
      .catch(function(err) {
        reject(err);
      })
    })
  },  

  getQuery: function(value, cb) {
    return new Promise(function (resolve, reject) {
      db.Query.findOne({where: value})  
      .then(function (query) {
        resolve(query)
      }).catch(function (err) {
        reject(err)
      })
    })
  },

  getNumbers: function(response) {
    var numbers = [];
    var queries = {};
      for (var i = 1; i <= 8; i++ ) {
        var count = 0;
        while(count < 1) {
          var randomIndex = Math.ceil(Math.random() * response.count)
          if(numbers.indexOf(randomIndex) === -1) {
            count++
            numbers.push(randomIndex);
          } 
        }
      }

    return numbers;
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

  getQueries: function(ids) {
    return new Promise(function(resolve, reject) {
      db.Query.findAll({where: {number: ids}})
      .then(function (query) {
        resolve(shuffle(query))
      }).catch(function (err) {
        reject(err)
      })
    })
  }
}
  
function shuffle(array) {
  console.log(array.length)
  var counter = array.length, temp, index;
  // While there are elements in the array
  while (counter > 0) {
      // Pick a random index
      index = Math.floor(Math.random() * counter);
      // Decrease counter by 1
      counter--;
      // And swap the last element with it
      temp = array[counter];
      array[counter] = array[index];
      array[index] = temp;
  }
  return array;
}