var db = require('../db/dbConfig.js');
var Query = db.Query;
var User = db.User;
// var HC = require('../home/homeController.js')
var PotentialQuery = db.PotentialQuery
var RandomGame = db.RandomGame;
var Promise = require('bluebird')

module.exports = {
  createNumbers: function() {
    return new Promise(function(resolve, reject) {
      db.Query.findAll({where: {number: ids}})
      .then(function (query) {
        resolve(shuffle(query))
      })
      .catch(function(err) {
        reject(err)
      })
    });
  },
  friendGame: function(gameInfo) {
    return new Promise(function(resolve,reject) {
      db.RandomGame.create(
        gameInfo
      )
    .then(function (game) {
      resolve(game)
    }).catch(function(err) {
        reject(err)
      })
  })
  },
  findRandomGame: function(user) {
    console.log(user, "++++++++++")
    return new Promise(function(resolve, reject) {
      db.RandomGame.findOrCreate({ 
        where: {
          user2: 'open',
          $and: {
          user1: {
              $notLike: '%' + user.name
            }
          }
        }, defaults: {
        user1: user.name,
        user1ID: user.id,
        user2: 'open',
        created: 0
        }
      })
      .then(function(game) {
        resolve(game)
      })
      .catch(function(err) {
        reject(err)
      })
      })
  },
  updateOpponent: function(game, user) {
    return new Promise(function(resolve, reject) {
      db.RandomGame.update({
        user2: user.name,
        user2ID: game,
        created: 2
      }, {
        where:
          {id: game}
      })
    .then(function(response) {
      resolve(response)
    })
    .catch(function(err) {
        reject(err)
      })
    })
  },
  retrieveGames: function(user) {
    return new Promise(function(resolve, reject) {
      db.RandomGame.findAll({
        where: {
          $or: {
            user1: user,
            user2: user
          } 
        }
      }).then(function(games){
        resolve(games)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  updateRandomGame: function(game, numbers, lightning) {
    return new Promise(function(resolve, reject) {
      db.RandomGame.update({
          questionRD1: numbers[0],
          questionRD2: numbers[1],
          questionRD3: numbers[2],
          questionRD4: lightning,
          created: 1
        }, {
          where: {id: game}
      })
      .then(function(response){
        console.log(response)
        resolve(response)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  updateScores: function(update, game) {
    return new Promise(function (resolve, reject) {
      var round = update.round

      db.RandomGame.update(
            update
      ,{
        where: {id: game}
      })
    .then(function(response){
        resolve(response)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  findOrCreateQuery: function (newQuery, table) {
    console.log(newQuery)
    return new Promise(function (resolve, reject) {
      db[table].findOrCreate({
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
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  findUser: function(user) {
    return new  Promise(function(resolve, reject) {
      db.User.findOne({
        where: {
          name: user.name
        }
      }).then(function(isFound) {
        resolve(isFound)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  findOrCreateUser: function(user) {
    console.log('line 161 in find or create=======================', user.name)
    return new Promise(function(resolve, reject) {
      db.User.findOrCreate({
        where: {
          name: user.name,
        }, defaults: {
          online: true,
          socket: user.socket
        }
      })
      .then(function(user) {
        console.log(user)
        resolve(user)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  updateUser: function (user) {
    console.log(user, "inside updateUser---------")
    return new Promise(function (resolve, reject) {
      db.User.update({
          online: true,
          socket: user.socket
        }, {
        where: {
          name: user.name
        }
      }).then(function (user) {
        resolve(user)
      }).catch(function(err) {
        reject(err)
      })
    })
  },
  logout: function(user) {
  return new Promise(function(resolve, reject) {
    db.User.update({
      online: false,
      socket: null
    }, { where: {
      id: user
      }
    }).then(function(log) {
      console.log(log)
    }).catch(function(err) {
        reject(err)
      })
  })
},
  
  getCount: function() {
    console.log('this should be runnninnggg');
    return new Promise(function (resolve, reject) {
      db.Query.findAndCountAll({})
      .then(function(size) {
        resolve(size)
      })
     .catch(function(err) {
        reject(err)
      })
    })
  },  

  getQuery: function(value, cb) {
    return new Promise(function (resolve, reject) {
      db.Query.findOne({where: value})  
      .then(function (query) {
        resolve(query)
      }).catch(function(err) {
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
  getQueries: function(ids) {
    return new Promise(function(resolve, reject) {
      db.Query.findAll({where: {number: ids}})
      .then(function (query) {
        resolve(shuffle(query))
      }).catch(function(err) {
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